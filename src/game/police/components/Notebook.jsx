import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { LuNotebook } from "react-icons/lu";

import { INSPECTION_RULE_SECTIONS } from "@game/inspections/data";

/**
 * ##### Notebook
 * -----> Polizeiliches Notizbuch fuer Spielinformationen und spaetere Wanted-List-Daten.
 */
export function Notebook () {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSectionId, setActiveSectionId] = useState(
        INSPECTION_RULE_SECTIONS[0].id
    );
    const activeSection = INSPECTION_RULE_SECTIONS.find(
        (section) => section.id === activeSectionId
    );
    
    return (
        <>
            <button 
                type="button"
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition cursor-pointer
                    ${isOpen
                        ? "bg-blue-600 text-white border-blue-700"
                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                    }
                `}
                onClick={() => setIsOpen(prev => !prev)}
                aria-expanded={isOpen}
            >
                <LuNotebook 
                    className="h-5 w-5 shrink-0"
                    aria-hidden="true"
                />
                Handbuch
            </button>

            {isOpen && (
                <section
                    className="fixed inset-x-4 bottom-4 z-[11000] mx-auto flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-zinc-300 bg-zinc-50 text-left text-zinc-900 shadow-2xl sm:bottom-8"
                    role="dialog"
                    aria-modal="false"
                    aria-labelledby="service-manual-title"
                >
                    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-4">
                        <div>
                            <p className="text-xs font-semibold uppercase text-blue-700">
                                Diensthandbuch
                            </p>
                            <h2 id="service-manual-title" className="!text-xl font-semibold">
                                Kontrollstelle
                            </h2>
                        </div>
                        <button
                            type="button"
                            className="rounded p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                            aria-label="Handbuch schließen"
                            onClick={() => setIsOpen(false)}
                        >
                            <FaXmark aria-hidden="true" />
                        </button>
                    </header>

                    <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[190px_1fr]">
                        <nav className="flex gap-1 overflow-x-auto border-b border-zinc-200 bg-zinc-100 p-3 sm:flex-col sm:border-b-0 sm:border-r">
                            {INSPECTION_RULE_SECTIONS.map((section) => (
                                <button
                                    type="button"
                                    key={section.id}
                                    className={`whitespace-nowrap rounded px-3 py-2 text-left text-sm font-semibold ${
                                        activeSectionId === section.id
                                            ? "bg-blue-700 text-white"
                                            : "text-zinc-600 hover:bg-white hover:text-zinc-950"
                                    }`}
                                    onClick={() => setActiveSectionId(section.id)}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </nav>

                        <article className="min-h-0 overflow-y-auto px-6 py-5">
                            <h3 className="!text-lg font-semibold">{activeSection.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                                {activeSection.intro}
                            </p>
                            <ol className="mt-5 space-y-3">
                                {activeSection.rules.map((rule, index) => (
                                    <li key={rule} className="flex gap-3 text-sm leading-6">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-blue-100 text-xs font-bold text-blue-800">
                                            {index + 1}
                                        </span>
                                        <span>{rule}</span>
                                    </li>
                                ))}
                            </ol>
                        </article>
                    </div>
                </section>
            )}
        </>
    );
    
}
