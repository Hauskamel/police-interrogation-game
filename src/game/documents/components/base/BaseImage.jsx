/**
 * ##### Base Image
 * -----> Einheitliche Bildanzeige fuer Dokument- und Personenbilder.
 * ---> Fehlende oder ungueltige Bilder fallen auf das neutrale Fahrerbild zurueck.
 */
export function BaseImage ({
    data,
    alt = "NPC",
    className = "h-20 w-20 object-cover"
}) {
    const imageSource = data
        ? `/images/driver/${data}`
        : "/images/driver/driver-unknown.jpg";

    // Verhindert ein dauerhaft defektes Bild, falls ein Datensatz auf eine nicht vorhandene Datei verweist.
    const handleImageError = (event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "/images/driver/driver-unknown.jpg";
    };

    return (
        <div className="inline-block">
            <img
                src={imageSource}
                className={className}
                alt={alt}
                onError={handleImageError}
            />
        </div>
    )
}
