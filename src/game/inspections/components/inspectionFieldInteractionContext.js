import { createContext } from "react";

// ##### Inspection Field Interaction Context
// -----> Teilt eine laufende Feldauswahl zwischen Dokumenten und Police Laptop.
// ---> Der inaktive Standardwert erlaubt beiden Oberflaechen auch ausserhalb einer Kontrolle zu rendern.
export const InspectionFieldInteractionContext = createContext({
    active: false,
    interactionMode: null,
    selectedFields: [],
    onSelectField: () => {}
});
