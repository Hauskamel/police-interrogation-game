import { useContext } from "react";

import {
    DISCREPANCY_CHECK_TYPES,
    DISCREPANCY_FIELD_DEFINITIONS_BY_ID,
    RADIO_INQUIRY_FIELD_DEFINITIONS_BY_ID
} from "../data";
import { InspectionFieldInteractionContext } from "../components/inspectionFieldInteractionContext.js";

// ##### Discrepancy Field Interaction
// -----> Leitet Auswahl und Kompatibilitaet fuer ein sichtbares Dokument- oder Registerfeld ab.
// ---> recordId unterscheidet gleichartige Laptopfelder aus verschiedenen Datenbankakten.
export function useInspectionFieldInteraction(fieldId, recordId = null) {
    const context = useContext(InspectionFieldInteractionContext);
    const definition = DISCREPANCY_FIELD_DEFINITIONS_BY_ID[fieldId];
    const radioDefinition = RADIO_INQUIRY_FIELD_DEFINITIONS_BY_ID[fieldId];
    const activeDefinition = context.interactionMode === "radio"
        ? radioDefinition
        : definition;
    const selectedField = context.selectedFields.find((field) => {
        return field.fieldId === fieldId
            && (field.recordId ?? null) === recordId;
    });
    const firstSelectedDefinition = DISCREPANCY_FIELD_DEFINITIONS_BY_ID[
        context.selectedFields[0]?.fieldId
    ];
    const compatibleWithFirstSelection = context.interactionMode === "radio"
        || !firstSelectedDefinition
        || firstSelectedDefinition.checkType === DISCREPANCY_CHECK_TYPES.SINGLE
        || (
            firstSelectedDefinition.surface !== definition?.surface
            && firstSelectedDefinition.comparisonGroup === definition?.comparisonGroup
        );

    return {
        isInteractive: Boolean(context.active && activeDefinition),
        isSelected: Boolean(selectedField),
        isCompatible: compatibleWithFirstSelection,
        selectField: (value) => context.onSelectField({
            fieldId,
            label: activeDefinition?.label,
            recordId,
            value
        })
    };
}
