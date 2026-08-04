// ##### Date Display Formatter
// -----> Formatiert gespeicherte ISO-Daten einheitlich als TT.MM.YYYY.
// ---> Die gespeicherten Werte bleiben unveraendert, damit Vergleiche stabil funktionieren.
export function formatDateForDisplay(value) {
    if (!value) return "Nicht erfasst";

    const isoDateMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDateMatch) {
        const [, year, month, day] = isoDateMatch;
        return `${day}.${month}.${year}`;
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}.${month}.${year}`;
}
