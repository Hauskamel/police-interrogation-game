import { BaseControlPanel } from "./BaseControlPanel.jsx";
import { VehicleOccupantsPanel } from "./VehicleOccupantsPanel.jsx";
import {
    useInspectionStore,
    useTrafficStore
} from "@stores";

/**
 * ##### Vehicle Control Panel
 * -----> Zeigt die direkten Spieler-Aktionen fuer ein ausgewaehltes NPC-Fahrzeug.
 */
export const VehicleControlPanel = ({
    isPinned = false,
    onClose,
    trafficEntity
}) => {
    const stopTrafficEntity = useTrafficStore((state) => state.stopTrafficEntity);
    const continueTrafficEntity = useTrafficStore((state) => state.continueTrafficEntity);
    const stoppedTrafficEntity = useTrafficStore((state) => state.trafficEntities.find(entity => entity.stopped));
    const activeInspection = useInspectionStore((state) => state.activeInspection);
    const lastCompletedInspection = useInspectionStore(
        (state) => state.lastCompletedInspection
    );
    const startInspection = useInspectionStore((state) => state.startInspection);
    const revealedDriverNpcId = useTrafficStore((state) =>
        state.revealedDriverIdentityByTrafficEntityId[trafficEntity?.id]
    );

    const selectedEntityIsStopped = Boolean(
        trafficEntity?.stopped
        && trafficEntity.id === stoppedTrafficEntity?.id
    );
    const anotherEntityIsStopped = Boolean(
        stoppedTrafficEntity
        && stoppedTrafficEntity.id !== trafficEntity?.id
    );
    const driverIdentityIsKnown = Boolean(
        selectedEntityIsStopped
        && revealedDriverNpcId === trafficEntity?.npcId
    );
    const selectedInspectionIsActive = activeInspection?.trafficEntityId
        === trafficEntity?.id;
    const selectedInspectionHasResult = lastCompletedInspection?.trafficEntityId
        === trafficEntity?.id;

    
    return (
        <>
            <BaseControlPanel 
                title="Fahrzeug Optionen" 
                isCloseable={!isPinned}
                onClose={onClose}
                positionClassName="bottom-24 left-4 sm:bottom-6 sm:left-[19rem]"
            >
                <VehicleOccupantsPanel
                    trafficEntity={trafficEntity}
                    showDriverIdentity={driverIdentityIsKnown}
                />

                <div className="flex gap-2">
                    {!stoppedTrafficEntity && !selectedEntityIsStopped && (
                        <button
                            onClick={() => {
                                stopTrafficEntity(trafficEntity.id);
                            }}
                            className="w-full !bg-red-500 text-white py-2 px-4 rounded-xl hover:bg-red-800 transition font-semibold shadow-md cursor-pointer"
                        >
                            Anhalten
                        </button>
                    )}

                    {selectedEntityIsStopped
                    && !selectedInspectionIsActive
                    && !selectedInspectionHasResult && (
                        <button
                            onClick={() => {
                                continueTrafficEntity(trafficEntity.id);
                                onClose?.();
                            }}
                            className="w-full bg-lime-600 text-white py-2 px-4 rounded-xl hover:bg-lime-700 transition font-semibold shadow-md cursor-pointer"
                        >
                            Weiterfahren
                        </button>
                    )}
                    
                </div>

                {selectedEntityIsStopped
                && !selectedInspectionIsActive
                && !selectedInspectionHasResult && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="w-full bg-sky-700 text-white py-2 px-4 rounded-xl hover:bg-sky-800 transition font-semibold shadow-md cursor-pointer"
                            onClick={() => startInspection(trafficEntity.id)}
                        >
                            Kontrolle beginnen
                        </button>
                    </div>
                )}

                {selectedInspectionIsActive && (
                    <p className="rounded bg-blue-50 px-3 py-2 text-xs text-blue-800">
                        Die Kontrolle läuft. Fordere die Dokumente im Gespräch mit dem
                        Fahrer an und belege erkannte Diskrepanzen direkt an den Dokumenten.
                    </p>
                )}

                {selectedInspectionHasResult && (
                    <p className="rounded bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                        Die Kontrolle ist abgeschlossen. Schließe den Kontrollbericht,
                        um das Fahrzeug freizugeben.
                    </p>
                )}

                {anotherEntityIsStopped && (
                    <p className="rounded bg-amber-50 px-3 py-2 text-xs text-amber-800">
                        Es wird bereits ein anderes Fahrzeug kontrolliert.
                    </p>
                )}
            </BaseControlPanel>
        </>
    );
};
