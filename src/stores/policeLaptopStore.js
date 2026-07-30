import { create } from "zustand";

// ##### Police Laptop Views
// -----> Beschreibt die aktuell geöffnete Hauptseite des Police Laptops.
export const POLICE_LAPTOP_VIEWS = {
    HOME: "home",
    DATABASE: "database"
};

// ##### Police Database Sections
// -----> Unterscheidet die freie Suche von der Fahndungsliste.
export const POLICE_DATABASE_SECTIONS = {
    SEARCH: "search",
    WANTED: "wanted"
};

// ##### Police Database Search Types
// -----> Legt fest, welche relationale Datenart die aktuelle Suche verwendet.
export const POLICE_DATABASE_SEARCH_TYPES = {
    PERSON: "person",
    LICENSE: "license",
    PLATE: "plate"
};

const initialPoliceLaptopState = {
    activeView: POLICE_LAPTOP_VIEWS.HOME,
    database: {
        activeSection: POLICE_DATABASE_SECTIONS.SEARCH,
        searchType: POLICE_DATABASE_SEARCH_TYPES.PERSON,
        query: "",
        selection: null
    }
};

// ##### Police Laptop Store
// -----> Bewahrt den Navigationszustand, wenn der Laptop geschlossen und neu geöffnet wird.
// ---> Es werden nur UI-Referenzen gespeichert, niemals Kopien polizeilicher Datensätze.
export const usePoliceLaptopStore = create((set) => ({
    ...initialPoliceLaptopState,

    setActiveView: (activeView) => {
        set({ activeView });
    },

    // Ein neuer Suchtext verwirft den bisherigen Treffer, da er nicht mehr zur Liste gehört.
    setDatabaseQuery: (query) => {
        set((state) => ({
            database: {
                ...state.database,
                query,
                selection: null
            }
        }));
    },

    // Beim Bereichswechsel bleibt die Suchkonfiguration erhalten, die Auswahl wird geleert.
    setDatabaseSection: (activeSection) => {
        set((state) => ({
            database: {
                ...state.database,
                activeSection,
                selection: null
            }
        }));
    },

    // Eine andere Suchart beginnt bewusst mit einer leeren Abfrage und ohne alten Treffer.
    setDatabaseSearchType: (searchType) => {
        set((state) => ({
            database: {
                ...state.database,
                searchType,
                query: "",
                selection: null
            }
        }));
    },

    setDatabaseSelection: (selection) => {
        set((state) => ({
            database: {
                ...state.database,
                selection
            }
        }));
    },

    // Eine neu generierte Polizeidatenbank darf keine Auswahl aus dem vorherigen Spiel erben.
    resetPoliceLaptopState: () => {
        set({
            activeView: initialPoliceLaptopState.activeView,
            database: {
                ...initialPoliceLaptopState.database
            }
        });
    }
}));
