import { useInspectionFieldInteraction } from "@game/inspections/hooks/useInspectionFieldInteraction.js";

/**
 * ##### Base Image
 * -----> Einheitliche Bildanzeige fuer Dokument- und Personenbilder.
 * ---> Fehlende oder ungueltige Bilder fallen auf das neutrale Fahrerbild zurueck.
 */
export function BaseImage ({
    data,
    alt = "NPC",
    className = "h-20 w-20 object-cover",
    fieldId = null,
    recordId = null,
    selectionValue = data
}) {
    const fieldInteraction = useInspectionFieldInteraction(fieldId, recordId);
    const imageSource = data
        ? `/images/driver/${data}`
        : "/images/driver/driver-unknown.jpg";

    // Verhindert ein dauerhaft defektes Bild, falls ein Datensatz auf eine nicht vorhandene Datei verweist.
    const handleImageError = (event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "/images/driver/driver-unknown.jpg";
    };

    const image = (
        <img
            src={imageSource}
            className={className}
            alt={alt}
            onError={handleImageError}
        />
    );

    if (fieldInteraction.isInteractive) {
        return (
            <button
                type="button"
                className={`inline-block rounded transition ${
                    fieldInteraction.isSelected
                        ? "ring-4 ring-blue-500"
                        : fieldInteraction.isCompatible
                            ? "hover:ring-4 hover:ring-blue-400"
                            : "opacity-45 hover:opacity-75 hover:ring-4 hover:ring-blue-400"
                }`}
                aria-label={`${alt} als Vergleichsbild auswählen`}
                aria-pressed={fieldInteraction.isSelected}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={() => fieldInteraction.selectField(selectionValue)}
            >
                {image}
            </button>
        );
    }

    return (
        <div className="inline-block">
            {image}
        </div>
    )
}
