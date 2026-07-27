import { BaseImage } from "@game/documents/components/base";

/**
 * ##### Vehicle Occupants Panel
 * -----> Zeigt das Fahrerbild innerhalb der Fahrzeugoptionen.
 * ---> Bild und Name werden erst sichtbar, nachdem der Spieler ein passendes Dokument geöffnet hat.
 */
export const VehicleOccupantsPanel = ({
    trafficEntity,
    showDriverIdentity
}) => {
    const presentedDriver = trafficEntity?.driverProfile?.presented;
    const driverName = [presentedDriver?.firstName, presentedDriver?.lastName]
        .filter(Boolean)
        .join(" ");

    return (
        <section className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <h4 className="mb-2 text-xs font-semibold uppercase text-gray-500">
                Fahrer
            </h4>

            <div className="flex items-center gap-3">
                <BaseImage
                    data={showDriverIdentity ? presentedDriver?.npcImage : null}
                    alt={showDriverIdentity && driverName ? driverName : "Unbekannter Fahrer"}
                    className="h-16 w-16 rounded object-cover"
                />

                <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                        {showDriverIdentity && driverName ? driverName : "Identitaet unbekannt"}
                    </p>
                    <p className="text-xs text-gray-500">
                        {showDriverIdentity ? "Identitaet bekannt" : "Identitaetsdokument pruefen"}
                    </p>
                </div>
            </div>
        </section>
    )
}
