import { createElement } from "react";
import { FaCar, FaFileSignature, FaIdCard } from "react-icons/fa";

import {
    INSPECTION_DOCUMENT_LABELS,
    INSPECTION_DOCUMENT_TYPES
} from "@game/inspections/data";


// ##### Document Conversation Options
// -----> Phase 1 bietet genau die drei Dokumentfragen der aktuellen Kontrollsession an.
const DOCUMENT_OPTIONS = [
    {
        type: INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE,
        icon: FaIdCard
    },
    {
        type: INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION,
        icon: FaCar
    },
    {
        type: INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE,
        icon: FaFileSignature
    }
];

const PLAYER_REQUESTS = {
    [INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE]:
        "Bitte zeigen Sie mir Ihren Führerschein.",
    [INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION]:
        "Bitte zeigen Sie mir die Fahrzeugpapiere.",
    [INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE]:
        "Bitte zeigen Sie mir den Versicherungsnachweis."
};

const DRIVER_RESPONSES = {
    [INSPECTION_DOCUMENT_TYPES.DRIVERS_LICENSE]:
        "Natürlich. Hier ist mein Führerschein.",
    [INSPECTION_DOCUMENT_TYPES.VEHICLE_REGISTRATION]:
        "Hier sind die Fahrzeugpapiere.",
    [INSPECTION_DOCUMENT_TYPES.PROOF_OF_INSURANCE]:
        "Hier ist der Versicherungsnachweis."
};

/**
 * ##### Document Conversation
 * -----> Bildet den einfachen Phase-1-Dialog zwischen Spieler und Fahrer ab.
 * ---> Fehlende oder verweigerte Dokumente kommen erst in einer späteren Ausbaustufe hinzu.
 */
export function DocumentConversation({
    requestedDocuments = [],
    visibleDocuments = [],
    onRequestDocument
}) {
    return (
        <section
            className="fixed bottom-4 right-4 z-[9000] flex h-[380px] max-h-[calc(100vh-2rem)] w-[min(580px,calc(100vw-2rem))] flex-col overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 text-left text-white shadow-2xl sm:right-8"
            aria-label="Gespräch mit dem Fahrer"
        >
            <header className="border-b border-zinc-700 px-4 py-3">
                <p className="text-xs font-semibold uppercase text-blue-400">
                    Gespräch mit Fahrer
                </p>
            </header>

            <div
                className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm"
                role="log"
                aria-live="polite"
            >
                <ConversationLine speaker="Fahrer" text="Guten Tag." />

                {requestedDocuments.map((documentType) => (
                    <div className="space-y-1" key={documentType}>
                        <ConversationLine
                            speaker="Sie"
                            text={PLAYER_REQUESTS[documentType]}
                        />
                        <ConversationLine
                            speaker="Fahrer"
                            text={DRIVER_RESPONSES[documentType]}
                        />
                    </div>
                ))}
            </div>

            <div className="border-t border-zinc-700 bg-zinc-950/70 px-3 py-3">
                <p className="mb-2 text-[10px] font-semibold uppercase text-zinc-400">
                    Ihre Auswahl
                </p>
                <div className="grid grid-cols-3 gap-2">
                    {DOCUMENT_OPTIONS.map(({ type, icon }) => {
                        const wasRequested = requestedDocuments.includes(type);
                        const isVisible = visibleDocuments.includes(type);
                        const label = getOptionLabel({
                            documentType: type,
                            wasRequested,
                            isVisible
                        });

                        return (
                            <button
                                type="button"
                                key={type}
                                className="flex min-w-0 items-center justify-center gap-2 rounded bg-zinc-700 px-2 py-2 text-xs font-semibold leading-4 hover:bg-zinc-600 disabled:cursor-default disabled:bg-blue-700 disabled:text-white"
                                disabled={isVisible}
                                onClick={() => onRequestDocument(type)}
                                title={label}
                            >
                                {createElement(icon, {
                                    className: "shrink-0",
                                    "aria-hidden": true
                                })}
                                <span className="text-center">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// Stellt Sprecher und Text im Verlauf klar gegenüber, ohne bereits ein Dialogsystem vorzutäuschen.
function ConversationLine({ speaker, text }) {
    if (!text) return null;

    return (
        <p className="leading-5 text-zinc-200">
            <strong className={speaker === "Sie" ? "text-blue-300" : "text-white"}>
                {speaker}:
            </strong>{" "}
            {text}
        </p>
    );
}

function getOptionLabel({ documentType, wasRequested, isVisible }) {
    const documentLabel = INSPECTION_DOCUMENT_LABELS[documentType];

    if (isVisible) return `${documentLabel} geöffnet`;
    if (wasRequested) return `${documentLabel} erneut ansehen`;
    return `${documentLabel} anfordern`;
}
