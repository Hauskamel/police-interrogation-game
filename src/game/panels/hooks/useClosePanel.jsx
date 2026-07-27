/**
 * ##### Close Panel Helper
 * -----> Startet die Ausblend-Animation und ruft danach die Panel-Close-Logik auf.
 * ---> Der Helper ist kein React Hook und traegt deshalb bewusst kein use-Praefix.
 */
export const closePanel = (setPanelVisibility, onClose) => {
    setTimeout(() => {
        onClose();
    }, 150);
    setPanelVisibility(false);
}
