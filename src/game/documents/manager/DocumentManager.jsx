import {
    BaseDocument,
    CarDocuments,
    DocumentBar,
    DriversLicense,
    ProofOfInsurance
} from "../components";
import {
    useInspectionStore,
    useTrafficStore
} from "@stores";

// ##### Driver Identity Documents
// -----> Nur Dokumente mit Daten des Fahrers duerfen dessen Identitaet im Kontrollpanel aufdecken.
// ---> Der Fahrzeugschein zaehlt nicht pauschal, weil dort der Halter und nicht zwingend der Fahrer steht.
const DRIVER_IDENTITY_DOCUMENTS = new Set([
    "driversLicense",
    "proofOfInsurance"
]);

/**
 * ##### Document Manager
 * -----> Verwaltet, welche Fahrzeug- und Fahrerdokumente aktuell geöffnet sind.
 */
export function DocumentManager() {
    const activeInspection = useInspectionStore(
        (state) => state.activeInspection
    );
    const controlledTrafficEntity = useTrafficStore((state) => {
        return state.trafficEntities.find(
            (entity) => entity.id === activeInspection?.trafficEntityId
        );
    });
    const revealDriverIdentity = useTrafficStore(
        (state) => state.revealDriverIdentity
    );
    const registerOpenedDocument = useInspectionStore(
        (state) => state.registerOpenedDocument
    );
    const toggleDocumentVisibility = useInspectionStore(
        (state) => state.toggleDocumentVisibility
    );

    const activeDocs = ["driversLicense", "carDocuments", "proofOfInsurance"];
    const visibleDocuments = activeInspection?.visibleDocuments ?? [];
    const openDocs = Object.fromEntries(
        activeDocs.map((documentType) => [
            documentType,
            visibleDocuments.includes(documentType)
        ])
    );
    
    const toggleDoc = (doc) => {
        const documentWillOpen = !openDocs[doc];

        // Bereits gelesene Identitaetsdaten bleiben fuer die laufende Kontrolle bekannt.
        if (
            documentWillOpen
            && DRIVER_IDENTITY_DOCUMENTS.has(doc)
            && controlledTrafficEntity?.id
            && controlledTrafficEntity?.npcId
        ) {
            revealDriverIdentity(
                controlledTrafficEntity.id,
                controlledTrafficEntity.npcId
            );
        }

        // Die Kontrollsession unterscheidet verfügbare von tatsächlich geöffneten Dokumenten.
        if (documentWillOpen) {
            registerOpenedDocument(doc);
        }

        toggleDocumentVisibility(doc);
    };

    const docComponents = {
        driversLicense: (
            <DriversLicense 
                key={"driversLicense"}
                driver={controlledTrafficEntity?.driverProfile}
            />
        ),
        carDocuments: (
            <CarDocuments
                key={"carDocuments"}
                car={controlledTrafficEntity?.vehicleProfile}
                owner={controlledTrafficEntity?.vehicleOwnerProfile}
            />
        ),
        proofOfInsurance: (
            <ProofOfInsurance
                key={"proofOfInsurance"}
                insurance={controlledTrafficEntity?.insuranceProfile}
                owner={controlledTrafficEntity?.vehicleOwnerProfile}
            />
        )
    }

    return (
        <>
            {activeDocs
                    .filter(doc => openDocs[doc])
                    .map(doc => (
                        <BaseDocument key={doc}>
                            {docComponents[doc]}
                        </BaseDocument>
                ))
            }

            <DocumentBar
                activeDocs={activeDocs}
                openDocs={openDocs}
                onSelect={toggleDoc}
            />
        </>
    );
}
