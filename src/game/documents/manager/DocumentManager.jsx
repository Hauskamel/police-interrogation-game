import {
    BaseDocument,
    CarDocuments,
    DocumentConversation,
    DriversLicense,
    ProofOfInsurance
} from "../components";
import {
    DOCUMENT_AVAILABILITY_STATUSES,
    INSPECTION_DOCUMENT_TYPES
} from "@game/inspections/data";
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
    const recordInterviewAnswer = useInspectionStore(
        (state) => state.recordInterviewAnswer
    );
    const activeDocs = Object.values(INSPECTION_DOCUMENT_TYPES);
    const requestedDocuments = activeInspection?.requestedDocuments ?? [];
    const visibleDocuments = activeInspection?.visibleDocuments ?? [];
    const discrepancyMode = activeInspection?.discrepancyMode ?? {
        active: false,
        selectedFields: []
    };
    const radioInquiryMode = activeInspection?.radioInquiryMode ?? {
        active: false
    };
    const fieldSelectionModeActive = Boolean(
        discrepancyMode.active || radioInquiryMode.active
    );

    const handleDocumentRequest = (documentType) => {
        const availability = controlledTrafficEntity?.documentAvailability?.[
            documentType
        ] ?? DOCUMENT_AVAILABILITY_STATUSES.PROVIDED;
        const previousAttempts = activeInspection?.documentRequestStates?.[
            documentType
        ]?.attempts ?? 0;
        const identityWillBeVisible = availability
            === DOCUMENT_AVAILABILITY_STATUSES.PROVIDED
            || availability === DOCUMENT_AVAILABILITY_STATUSES.DAMAGED
            || (
                availability === DOCUMENT_AVAILABILITY_STATUSES.INITIALLY_REFUSED
                && previousAttempts >= 1
            );

        // Bereits gelesene Identitaetsdaten bleiben fuer die laufende Kontrolle bekannt.
        if (
            DRIVER_IDENTITY_DOCUMENTS.has(documentType)
            && identityWillBeVisible
            && controlledTrafficEntity?.id
            && controlledTrafficEntity?.npcId
        ) {
            revealDriverIdentity(
                controlledTrafficEntity.id,
                controlledTrafficEntity.npcId
            );
        }

        requestDocument({ documentType, availability });
    };

    const handleInterviewQuestion = ({ id, playerText }) => {
        const statementProfile = controlledTrafficEntity?.statementProfile;
        const npcText = statementProfile?.responses?.[id];
        if (!npcText) return;

        recordInterviewAnswer({
            questionId: id,
            playerText,
            npcText,
            findingId: statementProfile.contradictionQuestionId === id
                ? "inconsistent_driver_statement"
                : null
        });
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
                            documentType={doc}
                            onClose={() => closeDocument(doc)}
                            discrepancyModeActive={fieldSelectionModeActive}
                        >
                            {docComponents[doc]}
                        </BaseDocument>
                ))
            }

            <DocumentConversation
                requestedDocuments={requestedDocuments}
                documentRequestStates={activeInspection?.documentRequestStates ?? {}}
                visibleDocuments={visibleDocuments}
                conversationEntries={activeInspection?.conversationEntries ?? []}
                dispatchConversationEntries={activeInspection?.dispatchConversationEntries ?? []}
                discrepancyModeActive={discrepancyMode.active}
                radioInquiryModeActive={radioInquiryMode.active}
                onRequestDocument={handleDocumentRequest}
                askedQuestionIds={activeInspection?.askedQuestionIds ?? []}
                onAskQuestion={handleInterviewQuestion}
            />
        </>
    );
}
