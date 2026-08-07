import { useState } from "react";

import {
    gameStates,
    useGameStore,
    useInspectionStore,
    useTrafficStore
} from "@stores";
import { finalizeInspection } from "../services";
import { InspectionActionDock } from "./InspectionActionDock.jsx";
import { InspectionDecisionDialog } from "./InspectionDecisionDialog.jsx";
import { InspectionFocusOverlay } from "./InspectionFocusOverlay.jsx";
import { InspectionResultDialog } from "./InspectionResultDialog.jsx";

// ##### Inspection Workspace
// -----> Verbindet die aktive Session mit Feldmodi, Abschlussdialog und Ergebnisbericht.
// ---> Fachliche Auswertung und Konsequenzen liegen im Finalization Service.
export function InspectionWorkspace() {
    const activeInspection = useInspectionStore((state) => state.activeInspection);
    const lastCompletedInspection = useInspectionStore(
        (state) => state.lastCompletedInspection
    );
    const startDiscrepancyMode = useInspectionStore(
        (state) => state.startDiscrepancyMode
    );
    const cancelDiscrepancyMode = useInspectionStore(
        (state) => state.cancelDiscrepancyMode
    );
    const startRadioInquiryMode = useInspectionStore(
        (state) => state.startRadioInquiryMode
    );
    const cancelRadioInquiryMode = useInspectionStore(
        (state) => state.cancelRadioInquiryMode
    );
    const dismissCompletedInspection = useInspectionStore(
        (state) => state.dismissCompletedInspection
    );
    const gameState = useGameStore((state) => state.gameState);
    const [decisionInspectionId, setDecisionInspectionId] = useState(null);
    const activeTrafficEntity = useTrafficStore((state) => {
        return state.trafficEntities.find(
            (entity) => entity.id === activeInspection?.trafficEntityId
        );
    });

    if (lastCompletedInspection) {
        return (
            <InspectionResultDialog
                inspection={lastCompletedInspection}
                onFinish={dismissCompletedInspection}
            />
        );
    }

    if (!activeInspection || !activeTrafficEntity) return null;

    const fieldModeActive = Boolean(
        activeInspection.discrepancyMode?.active
        || activeInspection.radioInquiryMode?.active
    );

    return (
        <>
            <InspectionActionDock
                inspection={activeInspection}
                onStartDiscrepancy={startDiscrepancyMode}
                onCancelDiscrepancy={cancelDiscrepancyMode}
                onStartRadioInquiry={startRadioInquiryMode}
                onCancelRadioInquiry={cancelRadioInquiryMode}
                onOpenDecision={() => {
                    setDecisionInspectionId(activeInspection.inspectionId);
                }}
            />

            {fieldModeActive && (
                <InspectionFocusOverlay
                    laptopOpen={gameState === gameStates.LAPTOP}
                    radioInquiryActive={activeInspection.radioInquiryMode?.active}
                />
            )}

            {decisionInspectionId === activeInspection.inspectionId && (
                <InspectionDecisionDialog
                    inspection={activeInspection}
                    onClose={() => setDecisionInspectionId(null)}
                    onSubmit={(playerDecision) => {
                        setDecisionInspectionId(null);
                        finalizeInspection({
                            inspectionSession: activeInspection,
                            trafficEntity: activeTrafficEntity,
                            playerDecision
                        });
                    }}
                />
            )}
        </>
    );
}
