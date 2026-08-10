import { createElement, useEffect, useRef, useState } from "react";
import {
    FaBriefcase,
    FaCar,
    FaFileSignature,
    FaIdCard,
    FaPassport,
    FaRadio,
    FaXmark
} from "react-icons/fa6";

import {
    INSPECTION_DOCUMENT_LABELS,
    INSPECTION_DOCUMENT_TYPES
} from "@game/inspections/data";
import { useInspectionFieldInteraction } from "@game/inspections/hooks/useInspectionFieldInteraction.js";


// ##### Document Conversation Options
// -----> Bietet Basisdokumente und kontextabhängige Aufenthaltspapiere an.
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
    },
    {
        type: INSPECTION_DOCUMENT_TYPES.RESIDENCE_PERMIT,
        icon: FaPassport
    },
    {
        type: INSPECTION_DOCUMENT_TYPES.WORK_PERMIT,
        icon: FaBriefcase
    }
];

const CONVERSATION_TABS = {
    DRIVER: "driver",
    DISPATCH: "dispatch"
};

/**
 * ##### Document Conversation
 * -----> Bildet Dokumentanfragen und kontextbezogene Standardfragen an den Fahrer ab.
 * ---> Die Antwortquelle bleibt austauschbar und kann später regelbasiert oder KI-gestützt sein.
 */
export function DocumentConversation({
    requestedDocuments = [],
    documentRequestStates = {},
    visibleDocuments = [],
    conversationEntries = [],
    dispatchConversationEntries = [],
    discrepancyModeActive = false,
    radioInquiryModeActive = false,
    availableDocumentTypes = [],
    onRequestDocument,
    askedQuestionIds = [],
    interviewQuestions = [],
    onAskQuestion
}) {
    const [openTabs, setOpenTabs] = useState([CONVERSATION_TABS.DRIVER]);
    const [activeTab, setActiveTab] = useState(CONVERSATION_TABS.DRIVER);
    const conversationLogRef = useRef(null);

    // Der Funkmodus oeffnet den Zentralenkanal automatisch, ohne den Fahrerverlauf zu verlieren.
    useEffect(() => {
        if (!radioInquiryModeActive) return;

        setOpenTabs((currentTabs) => appendOnce(
            currentTabs,
            CONVERSATION_TABS.DISPATCH
        ));
        setActiveTab(CONVERSATION_TABS.DISPATCH);
    }, [radioInquiryModeActive]);

    // Nach einer Antwort bleibt die Zentrale sichtbar, auch wenn der Modus bereits beendet wurde.
    useEffect(() => {
        if (dispatchConversationEntries.length === 0) return;

        setOpenTabs((currentTabs) => appendOnce(
            currentTabs,
            CONVERSATION_TABS.DISPATCH
        ));
        setActiveTab(CONVERSATION_TABS.DISPATCH);
    }, [dispatchConversationEntries.length]);

    // Der Verlauf waechst bis zur Maximalhoehe und zeigt bei neuen Eintraegen die letzte Antwort.
    // Reiter und Aktionsleisten liegen ausserhalb dieses Scrollbereichs und bleiben unveraendert.
    useEffect(() => {
        const conversationLog = conversationLogRef.current;
        if (!conversationLog) return;

        conversationLog.scrollTop = conversationLog.scrollHeight;
    }, [
        activeTab,
        conversationEntries.length,
        dispatchConversationEntries.length,
        radioInquiryModeActive
    ]);

    const closeTab = (tabId) => {
        setOpenTabs((currentTabs) => {
            const remainingTabs = currentTabs.filter((openTab) => openTab !== tabId);

            if (activeTab === tabId) {
                setActiveTab(remainingTabs[0] ?? null);
            }

            return remainingTabs;
        });
    };

    const openTab = (tabId) => {
        setOpenTabs((currentTabs) => appendOnce(currentTabs, tabId));
        setActiveTab(tabId);
    };

    return (
        <section
            className={`fixed bottom-4 right-4 z-[9500] flex max-h-[50vh] w-[min(580px,calc(100vw-2rem))] flex-col overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 text-left text-white shadow-2xl transition sm:right-8 ${
                discrepancyModeActive
                    ? "ring-1 ring-blue-500 opacity-100"
                    : "opacity-100"
            }`}
            aria-label="Gespräch mit dem Fahrer"
        >
            <header className="flex h-12 shrink-0 items-end gap-1 border-b border-zinc-700 bg-zinc-950 px-3 pt-2">
                {openTabs.map((tabId) => (
                    <ConversationTab
                        key={tabId}
                        tabId={tabId}
                        active={activeTab === tabId}
                        onActivate={() => setActiveTab(tabId)}
                        onClose={() => closeTab(tabId)}
                    />
                ))}

                <div className="ml-auto flex gap-1 pb-2">
                    {!openTabs.includes(CONVERSATION_TABS.DRIVER) && (
                        <ReopenTabButton label="Fahrer öffnen" onClick={() => openTab(CONVERSATION_TABS.DRIVER)} />
                    )}
                    {!openTabs.includes(CONVERSATION_TABS.DISPATCH) && (
                        <ReopenTabButton label="Zentrale öffnen" onClick={() => openTab(CONVERSATION_TABS.DISPATCH)} />
                    )}
                </div>
            </header>

            {activeTab === CONVERSATION_TABS.DRIVER && (
                <div className="shrink-0 border-b border-zinc-700 bg-zinc-950/70">
                    <div className="flex h-14 items-center gap-3 border-b border-zinc-800 px-3">
                        <p className="shrink-0 text-[10px] font-semibold uppercase text-zinc-400">
                            Dokumente
                        </p>
                        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {DOCUMENT_OPTIONS
                            .filter(({ type }) => availableDocumentTypes.includes(type))
                            .map(({ type, icon }) => {
                                const wasRequested = requestedDocuments.includes(type);
                                const isVisible = visibleDocuments.includes(type);
                                const label = getOptionLabel({
                                    documentType: type,
                                    wasRequested,
                                    isVisible,
                                    requestState: documentRequestStates[type]
                                });
                                const terminalRequest = isTerminalDocumentRequest(
                                    documentRequestStates[type]
                                );

                                return (
                                    <button
                                        type="button"
                                        key={type}
                                        className={getDocumentButtonClass({
                                            isVisible,
                                            terminalRequest
                                        })}
                                        disabled={isVisible || terminalRequest}
                                        onClick={() => onRequestDocument(type)}
                                        title={label}
                                        aria-label={label}
                                    >
                                        {createElement(icon, {
                                            className: "h-4 w-4 shrink-0",
                                            "aria-hidden": true
                                        })}
                                        <span className="sr-only">{label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex h-12 items-center gap-3 px-3">
                        <p className="shrink-0 text-[10px] font-semibold uppercase text-zinc-400">
                            Befragen
                        </p>
                        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            {interviewQuestions.map((option) => (
                                <button
                                    type="button"
                                    key={option.id}
                                    className="shrink-0 whitespace-nowrap rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold hover:border-zinc-500 hover:bg-zinc-700"
                                    onClick={() => onAskQuestion(option)}
                                >
                                    {askedQuestionIds.includes(option.id) && !option.followUp
                                        ? `${option.label} erneut fragen`
                                        : option.label
                                    }
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div
                ref={conversationLogRef}
                className="min-h-[5.5rem] max-h-[calc(50vh-10rem)] flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm"
                role="log"
                aria-live="polite"
            >
                {activeTab === CONVERSATION_TABS.DRIVER && (
                    <DriverConversation
                        conversationEntries={conversationEntries}
                    />
                )}

                {activeTab === CONVERSATION_TABS.DISPATCH && (
                    <DispatchConversation
                        radioInquiryModeActive={radioInquiryModeActive}
                        entries={dispatchConversationEntries}
                    />
                )}

                {!activeTab && (
                    <p className="text-zinc-400">
                        Öffnen Sie oben einen Gesprächsreiter.
                    </p>
                )}
            </div>
        </section>
    );
}

function ConversationTab({ tabId, active, onActivate, onClose }) {
    const isDispatch = tabId === CONVERSATION_TABS.DISPATCH;
    const label = isDispatch ? "Zentrale" : "Fahrer";

    return (
        <div className={`flex items-center rounded-t border border-b-0 ${
            active
                ? "border-zinc-600 bg-zinc-800 text-white"
                : "border-zinc-800 bg-zinc-900 text-zinc-400"
        }`}>
            <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold"
                aria-pressed={active}
                onClick={onActivate}
            >
                {isDispatch && <FaRadio aria-hidden="true" />}
                {label}
            </button>
            <button
                type="button"
                className="mr-1 flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:bg-zinc-700 hover:text-white"
                aria-label={`${label}-Reiter schließen`}
                onClick={onClose}
            >
                <FaXmark aria-hidden="true" />
            </button>
        </div>
    );
}

function ReopenTabButton({ label, onClick }) {
    return (
        <button
            type="button"
            className="rounded border border-zinc-700 px-2 py-1 text-[10px] font-semibold text-zinc-400 hover:border-zinc-500 hover:text-white"
            onClick={onClick}
        >
            + {label}
        </button>
    );
}

function DriverConversation({ conversationEntries }) {
    return (
        <>
            <ConversationLine speaker="Fahrer" text="Guten Tag." />

            {conversationEntries.map((entry) => (
                <div className="space-y-1" key={entry.id}>
                    <ConversationLine speaker="Sie" text={entry.playerText} />
                    <ConversationLine
                        speaker="Fahrer"
                        text={entry.npcText}
                        statementField={entry.statementField}
                    />
                </div>
            ))}
        </>
    );
}

function DispatchConversation({ radioInquiryModeActive, entries }) {
    return (
        <>
            <ConversationLine speaker="Zentrale" text="Zentrale hört." />

            {radioInquiryModeActive && (
                <p className="rounded border border-blue-800 bg-blue-950/50 px-3 py-2 text-xs text-blue-200">
                    Markieren Sie jetzt eine Angabe auf einem geöffneten Dokument.
                </p>
            )}

            {entries.map((entry) => (
                <div className="space-y-1" key={entry.id}>
                    <ConversationLine speaker="Sie" text={entry.playerText} />
                    <ConversationLine speaker="Zentrale" text={entry.dispatchText} />
                </div>
            ))}
        </>
    );
}

// Stellt Sprecher und Text im Verlauf klar gegenüber, ohne bereits ein Dialogsystem vorzutäuschen.
function ConversationLine({ speaker, text, statementField = null }) {
    const fieldInteraction = useInspectionFieldInteraction(
        statementField?.fieldId
    );
    if (!text) return null;

    const content = statementField && fieldInteraction.isInteractive
        ? (
            <button
                type="button"
                className={`rounded px-1 text-left underline decoration-dotted underline-offset-2 ${
                    fieldInteraction.isSelected
                        ? "bg-blue-700 text-white"
                        : fieldInteraction.isCompatible
                            ? "hover:bg-zinc-700"
                            : "cursor-not-allowed opacity-40"
                }`}
                disabled={!fieldInteraction.isCompatible}
                onClick={() => fieldInteraction.selectField(statementField.value)}
            >
                {text}
            </button>
        )
        : text;

    return (
        <p className="leading-5 text-zinc-200">
            <strong className={speaker === "Sie"
                ? "text-blue-300"
                : speaker === "Zentrale"
                    ? "text-amber-300"
                    : "text-white"
            }>
                {speaker}:
            </strong>{" "}
            {content}
        </p>
    );
}

function appendOnce(values, value) {
    return values.includes(value) ? values : [...values, value];
}

function getOptionLabel({ documentType, wasRequested, isVisible, requestState }) {
    const documentLabel = INSPECTION_DOCUMENT_LABELS[documentType];

    if (isVisible) return `${documentLabel} geöffnet`;
    if (requestState?.result === "initially_refused") return `${documentLabel} erneut verlangen`;
    if (requestState?.result === "refused") return `${documentLabel} endgültig verweigert`;
    if (requestState?.result === "wrong_document") return "Unpassender Nachweis vorgelegt";
    if (requestState?.result === "unavailable") return `${documentLabel} nicht verfügbar`;
    if (wasRequested) return `${documentLabel} erneut ansehen`;
    return `${documentLabel} anfordern`;
}

function isTerminalDocumentRequest(requestState) {
    return ["unavailable", "refused", "wrong_document"].includes(
        requestState?.result
    );
}

// Dokumentbuttons bleiben immer quadratisch; Farbe und Tooltip transportieren ihren Zustand.
function getDocumentButtonClass({ isVisible, terminalRequest }) {
    const baseClasses = "flex h-9 w-9 shrink-0 items-center justify-center rounded border text-sm transition";

    if (isVisible) {
        return `${baseClasses} cursor-default border-blue-500 bg-blue-700 text-white`;
    }

    if (terminalRequest) {
        return `${baseClasses} cursor-not-allowed border-zinc-700 bg-zinc-800 text-zinc-500`;
    }

    return `${baseClasses} border-zinc-600 bg-zinc-700 text-zinc-100 hover:border-zinc-400 hover:bg-zinc-600`;
}
