import {
    BaseDocument,
    CarDocuments,
    DocumentConversation,
    DriversLicense,
    ProofOfInsurance
} from "../components";
import { INSPECTION_DOCUMENT_TYPES } from "@game/inspections/data";
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
    const requestDocument = useInspectionStore(
        (state) => state.requestDocument
    );
    const closeDocument = useInspectionStore(
        (state) => state.closeDocument
    );

    const activeDocs = Object.values(INSPECTION_DOCUMENT_TYPES);
    const requestedDocuments = activeInspection?.requestedDocuments ?? [];
    const visibleDocuments = activeInspection?.visibleDocuments ?? [];

    const handleDocumentRequest = (documentType) => {
        // Bereits gelesene Identitaetsdaten bleiben fuer die laufende Kontrolle bekannt.
        if (
            DRIVER_IDENTITY_DOCUMENTS.has(documentType)
            && controlledTrafficEntity?.id
            && controlledTrafficEntity?.npcId
        ) {
            revealDriverIdentity(
                controlledTrafficEntity.id,
                controlledTrafficEntity.npcId
            );
        }

        requestDocument(documentType);
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
                    .filter(doc => visibleDocuments.includes(doc))
                    .map(doc => (
                        <BaseDocument
                            key={doc}
                            onClose={() => closeDocument(doc)}
                        >
                            {docComponents[doc]}
                        </BaseDocument>
                ))
            }

            <DocumentConversation
                requestedDocuments={requestedDocuments}
                visibleDocuments={visibleDocuments}
                onRequestDocument={handleDocumentRequest}
            />
        </>
    );
}
