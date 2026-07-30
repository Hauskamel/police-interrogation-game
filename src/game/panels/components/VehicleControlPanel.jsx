import { BaseControlPanel } from "./BaseControlPanel.jsx";
import { VehicleOccupantsPanel } from "./VehicleOccupantsPanel.jsx";
import {
    selectSelectedTrafficEntity,
    useGuiVisibilityStatesStore,
    useInspectionStore,
    useTrafficStore
} from "@stores";


import { closePanel } from "../hooks";


/**
 * ##### Vehicle Control Panel
 * -----> Zeigt die direkten Spieler-Aktionen fuer ein ausgewaehltes NPC-Fahrzeug.
 */
export const VehicleControlPanel = ({
    onClose
}) => {
    const stopTrafficEntity = useTrafficStore((state) => state.stopTrafficEntity);
    const continueTrafficEntity = useTrafficStore((state) => state.continueTrafficEntity);
    const selectedTrafficEntity = useTrafficStore(selectSelectedTrafficEntity);
    const stoppedTrafficEntity = useTrafficStore((state) => state.trafficEntities.find(entity => entity.stopped));
    const activeInspection = useInspectionStore((state) => state.activeInspection);
    const lastCompletedInspection = useInspectionStore(
        (state) => state.lastCompletedInspection
    );
    const startInspection = useInspectionStore((state) => state.startInspection);
    const revealedDriverNpcId = useTrafficStore((state) =>
        state.revealedDriverIdentityByTrafficEntityId[selectedTrafficEntity?.id]
    );

    const setPanelVisibility = useGuiVisibilityStatesStore(state => state.setControlPanelVisibilityState)
    const selectedEntityIsStopped = Boolean(
        selectedTrafficEntity?.stopped
        && selectedTrafficEntity.id === stoppedTrafficEntity?.id
    );
    const anotherEntityIsStopped = Boolean(
        stoppedTrafficEntity
        && stoppedTrafficEntity.id !== selectedTrafficEntity?.id
    );
    const driverIdentityIsKnown = Boolean(
        selectedEntityIsStopped
        && revealedDriverNpcId === selectedTrafficEntity?.npcId
    );
    const selectedInspectionIsActive = activeInspection?.trafficEntityId
        === selectedTrafficEntity?.id;
    const selectedInspectionHasResult = lastCompletedInspection?.trafficEntityId
        === selectedTrafficEntity?.id;

    
    return (
        <>
            <BaseControlPanel 
                title="Fahrzeug Optionen" 
                margin="bottom-6" 
                onClose={onClose} 
            >
                <VehicleOccupantsPanel
                    trafficEntity={selectedTrafficEntity}
                    showDriverIdentity={driverIdentityIsKnown}
                />

                <div className="flex gap-2">
                    {!stoppedTrafficEntity && !selectedEntityIsStopped && (
                        <button
                            onClick={() => {
                                stopTrafficEntity(selectedTrafficEntity.id);
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
                                closePanel(setPanelVisibility, onClose)
                                continueTrafficEntity(selectedTrafficEntity.id);
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
                            onClick={() => startInspection(selectedTrafficEntity.id)}
                        >
                            Kontrolle beginnen
                        </button>
                    </div>
                )}

                {selectedInspectionIsActive && (
                    <p className="rounded bg-blue-50 px-3 py-2 text-xs text-blue-800">
                        Die Kontrolle läuft. Öffne Dokumente und markiere Auffälligkeiten
                        über die Kontrollleiste.
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
