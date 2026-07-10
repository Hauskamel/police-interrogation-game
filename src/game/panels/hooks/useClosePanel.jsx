/**
 * ##### Close Panel Helper
 * -----> Startet die Ausblend-Animation und ruft danach die Panel-Close-Logik auf.
 */
export const useClosePanel = (setPanelVisibility, onClose) => {
    setTimeout(() => {
        onClose();
    }, 150);
    setPanelVisibility(false);
}
