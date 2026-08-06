import { useInspectionFieldInteraction } from "@game/inspections/hooks/useInspectionFieldInteraction.js";

/**
 * ##### Base Headline With Text
 * -----> Einheitliche Label-/Wert-Anzeige fuer Dokumentfelder.
 */
export const BaseHeadlineWithText = ({
    headline,
    data,
    fieldId,
    selectionValue = data,
    individualWidth
}) => {
    const {
        isInteractive,
        isSelected,
        isCompatible,
        selectField
    } = useInspectionFieldInteraction(fieldId);
    const widthClass = individualWidth || "w-full";
    const content = (
        <>
            <strong>{headline || ""}</strong>
            <p>{data}</p>
        </>
    );

    if (isInteractive) {
        return (
            <button
                type="button"
                className={`${widthClass} rounded px-1 py-0.5 text-left transition ${
                    isSelected
                        ? "bg-blue-700 text-white ring-2 ring-blue-300"
                        : isCompatible
                            ? "hover:bg-blue-100 hover:ring-2 hover:ring-blue-500"
                            : "opacity-45 hover:opacity-75"
                }`}
                aria-pressed={isSelected}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => selectField(selectionValue)}
            >
                {content}
            </button>
        );
    }

    return (
        <div className={widthClass}>{content}</div>
    );
};
