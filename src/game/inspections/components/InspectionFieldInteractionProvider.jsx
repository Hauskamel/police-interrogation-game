import { createDiscrepancyDialogueTurn } from "../dialogue";
import { createEntityId } from "@game/shared";
import {
    DISCREPANCY_RESULT_STATUSES,
    getDiscrepancyFieldDefinition,
    resolveDiscrepancySelection,
    resolveRadioInquiry
} from "../utils";
import {
    useInspectionStore,
    useNpcStore,
    useOfficialRegistryStore,
    useTrafficStore
} from "@stores";

import { InspectionFieldInteractionContext } from "./inspectionFieldInteractionContext.js";

// ##### Inspection Field Interaction Provider
// -----> Orchestriert eine Feldauswahl einmal fuer Dokumente und Police Laptop.
// ---> Auswertung, Dialog und Sessionmutation bleiben dadurch ausserhalb der beiden UIs.
export function InspectionFieldInteractionProvider({ children }) {
    const activeInspection = useInspectionStore(
        (state) => state.activeInspection
    );
    const controlledTrafficEntity = useTrafficStore((state) => {
        return state.trafficEntities.find(
            (entity) => entity.id === activeInspection?.trafficEntityId
        );
    });
    const setDiscrepancySelection = useInspectionStore(
        (state) => state.setDiscrepancySelection
    );
    const recordDiscrepancy = useInspectionStore(
        (state) => state.recordDiscrepancy
    );
    const setRadioInquirySelection = useInspectionStore(
        (state) => state.setRadioInquirySelection
    );
    const recordRadioInquiry = useInspectionStore(
        (state) => state.recordRadioInquiry
    );
    const officialRegistry = useOfficialRegistryStore(
        (state) => state.officialRegistry
    );
    const criminalDatabase = useNpcStore(
        (state) => state.criminalDatabase
    );
    const discrepancyMode = activeInspection?.discrepancyMode ?? {
        active: false,
        selectedFields: []
    };
    const radioInquiryMode = activeInspection?.radioInquiryMode ?? {
        active: false,
        selectedField: null
    };

    const handleFieldSelection = async (field) => {
        if (radioInquiryMode.active) {
            handleRadioFieldSelection(field);
            return;
        }

        if (!controlledTrafficEntity || discrepancyMode.isResolving) return;

        const selectedFields = getNextSelectedFields(
            discrepancyMode.selectedFields,
            field
        );
        const result = resolveDiscrepancySelection({
            selectedFields,
            trafficEntity: controlledTrafficEntity,
            officialRegistry,
            inspectedAt: activeInspection.startedAt
        });

        if (result.status === DISCREPANCY_RESULT_STATUSES.WAITING_FOR_SECOND_FIELD) {
            setDiscrepancySelection({
                selectedFields,
                feedback: "Wählen Sie das passende Feld im Dokument oder Police Laptop aus."
            });
            return;
        }

        if (result.status === DISCREPANCY_RESULT_STATUSES.INCOMPATIBLE_FIELDS) {
            setDiscrepancySelection({
                selectedFields: [field],
                feedback: "Diese Felder lassen sich nicht direkt vergleichen. Neue Auswahl gestartet."
            });
            return;
        }

        if (result.status === DISCREPANCY_RESULT_STATUSES.NO_DISCREPANCY) {
            setDiscrepancySelection({
                selectedFields: [],
                feedback: result.reason === "wrong_registry_record"
                    ? "Der gewählte Registerdatensatz gehört nicht zur kontrollierten Person oder zum kontrollierten Fahrzeug."
                    : "Zwischen den ausgewählten Angaben ist keine belegbare Diskrepanz erkennbar."
            });
            return;
        }

        setDiscrepancySelection({
            selectedFields,
            feedback: "Diskrepanz wird angesprochen ...",
            isResolving: true
        });

        const conversationEntry = await createDiscrepancyDialogueTurn({
            findingId: result.findingId,
            selectedFields
        });

        recordDiscrepancy({
            findingId: result.findingId,
            conversationEntry,
            evidence: selectedFields
        });
    };

    const handleRadioFieldSelection = (field) => {
        if (!activeInspection || radioInquiryMode.isResolving) return;

        setRadioInquirySelection({
            selectedField: field,
            feedback: "Zentrale prüft die durchgegebene Angabe ...",
            isResolving: true
        });

        const response = resolveRadioInquiry({
            field,
            officialRegistry,
            criminalDatabase,
            inspectedAt: activeInspection.startedAt
        });

        recordRadioInquiry({
            findingId: response.findingId,
            evidence: [field],
            conversationEntry: {
                id: createEntityId("radio-message"),
                fieldId: field.fieldId,
                playerText: response.playerText,
                dispatchText: response.dispatchText
            }
        });
    };

    const interactionMode = radioInquiryMode.active
        ? "radio"
        : discrepancyMode.active
            ? "discrepancy"
            : null;
    const selectedFields = interactionMode === "radio"
        ? [radioInquiryMode.selectedField].filter(Boolean)
        : discrepancyMode.selectedFields ?? [];

    return (
        <InspectionFieldInteractionContext.Provider value={{
            active: Boolean(interactionMode),
            interactionMode,
            selectedFields,
            onSelectField: handleFieldSelection
        }}>
            {children}
        </InspectionFieldInteractionContext.Provider>
    );
}

// Ein Einzelfeld ersetzt die alte Auswahl. Paarfelder sammeln maximal zwei sichtbare Werte.
function getNextSelectedFields(currentFields, field) {
    const definition = getDiscrepancyFieldDefinition(field.fieldId);
    if (!definition) return [];

    if (definition.checkType === "single") return [field];

    const sameFieldIsSelected = currentFields.some((selectedField) => {
        return selectedField.fieldId === field.fieldId
            && (selectedField.recordId ?? null) === (field.recordId ?? null);
    });

    if (sameFieldIsSelected) {
        return currentFields.filter((selectedField) => {
            return selectedField.fieldId !== field.fieldId
                || (selectedField.recordId ?? null) !== (field.recordId ?? null);
        });
    }

    return currentFields.length === 1
        ? [...currentFields, field]
        : [field];
}
