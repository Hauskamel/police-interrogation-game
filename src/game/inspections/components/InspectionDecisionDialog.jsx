import { useState } from "react";
import { FaXmark } from "react-icons/fa6";

import {
    INSPECTION_DECISION_OPTIONS,
    INSPECTION_FINDING_DEFINITIONS_BY_ID
} from "../data";

// ##### Inspection Decision Dialog
// -----> Sammelt Maßnahme und bewusst belegte Gründe, ohne die Auswertung selbst zu kennen.
export function InspectionDecisionDialog({ inspection, onClose, onSubmit }) {
    const [selectedDecision, setSelectedDecision] = useState(null);
    const [selectedReasonCodes, setSelectedReasonCodes] = useState(
        inspection.findings.map((finding) => finding.findingId)
    );

    const submitDecision = () => {
        if (!selectedDecision) return;

        onSubmit({
            type: selectedDecision,
            reasonCodes: [...selectedReasonCodes]
        });
    };

    return (
        <InspectionDialog
            title="Kontrolle abschließen"
            description="Wähle Maßnahme und die Feststellungen, auf die du deine Entscheidung stützt."
            onClose={onClose}
        >
            <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-left text-xs leading-5 text-blue-900">
                <strong>Dienstregel:</strong> Aktive Fahndungen werden gemeldet.
                Manipulierte Dokumente werden sichergestellt, widersprüchliche
                Identitätsangaben vor Ort geklärt. Fehlende oder abgelaufene
                Pflichtnachweise verhindern die Weiterfahrt. Polizeibekanntheit
                allein ist kein Grund für eine Maßnahme.
            </div>

            <div className="space-y-2">
                {INSPECTION_DECISION_OPTIONS.map((option) => (
                    <label
                        key={option.id}
                        className={`flex cursor-pointer gap-3 rounded-md border p-3 text-left ${
                            selectedDecision === option.id
                                ? "border-blue-600 bg-blue-50"
                                : "border-zinc-200 bg-white hover:border-zinc-300"
                        }`}
                    >
                        <input
                            type="radio"
                            name="inspection-decision"
                            className="mt-1 accent-blue-700"
                            checked={selectedDecision === option.id}
                            onChange={() => setSelectedDecision(option.id)}
                        />
                        <span>
                            <span className="block text-sm font-semibold text-zinc-950">
                                {option.label}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-zinc-500">
                                {option.description}
                            </span>
                        </span>
                    </label>
                ))}
            </div>

            <FindingSelection
                findings={inspection.findings}
                selectedReasonCodes={selectedReasonCodes}
                onToggle={(findingId) => {
                    setSelectedReasonCodes((current) => {
                        return current.includes(findingId)
                            ? current.filter((id) => id !== findingId)
                            : [...current, findingId];
                    });
                }}
            />

            <button
                type="button"
                className="mt-5 w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
                disabled={!selectedDecision}
                onClick={submitDecision}
            >
                Entscheidung bestätigen
            </button>
        </InspectionDialog>
    );
}

function FindingSelection({ findings, selectedReasonCodes, onToggle }) {
    return (
        <div className="mt-5 border-t border-zinc-200 pt-4 text-left">
            <h3 className="text-sm font-semibold">Begründung</h3>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
                Es werden nur Feststellungen angeboten, die du während dieser Kontrolle belegt hast.
            </p>
            {findings.length === 0 ? (
                <p className="mt-3 rounded bg-zinc-100 px-3 py-2 text-xs text-zinc-500">
                    Keine Feststellung dokumentiert.
                </p>
            ) : (
                <div className="mt-3 space-y-2">
                    {findings.map((finding) => {
                        const definition = INSPECTION_FINDING_DEFINITIONS_BY_ID[
                            finding.findingId
                        ];

                        return (
                            <label
                                key={finding.id}
                                className="flex cursor-pointer gap-3 rounded border border-zinc-200 bg-white p-3 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    className="mt-0.5 accent-blue-700"
                                    checked={selectedReasonCodes.includes(finding.findingId)}
                                    onChange={() => onToggle(finding.findingId)}
                                />
                                <span>
                                    <strong className="block">
                                        {definition?.label ?? finding.findingId}
                                    </strong>
                                    <span className="mt-1 block text-xs text-zinc-500">
                                        Erkannt durch {getFindingSourceLabel(finding.discoveredVia)}
                                    </span>
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function InspectionDialog({ title, description, children, onClose }) {
    return (
        <div className="fixed inset-0 z-[13000] flex items-center justify-center bg-black/55 p-4">
            <section
                className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md bg-zinc-50 text-zinc-900 shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="inspection-dialog-title"
            >
                <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-zinc-200 bg-white px-5 py-4">
                    <div className="text-left">
                        <h2 id="inspection-dialog-title" className="!text-lg font-semibold">
                            {title}
                        </h2>
                        <p className="mt-1 text-xs leading-5 text-zinc-500">
                            {description}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="rounded p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                        aria-label="Dialog schließen"
                        onClick={onClose}
                    >
                        <FaXmark aria-hidden="true" />
                    </button>
                </header>
                <div className="px-5 py-4">{children}</div>
            </section>
        </div>
    );
}

function getFindingSourceLabel(source) {
    const labelBySource = {
        document_comparison: "Dokumentenvergleich",
        radio_inquiry: "Funkabfrage",
        document_request: "Dokumentanfrage"
    };

    return labelBySource[source] ?? source;
}
