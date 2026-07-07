import { create } from "zustand";

// ##### UI Visibility Store
// -----> Hält einfache Sichtbarkeitszustände für Control Panels und Dokumente.
export const useGuiVisibilityStatesStore = create((set) => ({
    controlPanelsVisible: false,
    documentsVisible: false,
    setControlPanelVisibilityState: (state) => {
        set({
            controlPanelsVisible: state
        })
    },
    setDocumentVisibilityState: (state) => {
        set({
            documentsVisible: state
        })
    }
}));
