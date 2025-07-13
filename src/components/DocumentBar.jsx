import { FaIdCard, FaCar } from "react-icons/fa";
import { LuNotebook } from "react-icons/lu";

// TODO: NOTEBOOK AUS DOCUMENTBAR ENTFERNEN -> FÜR DIESE BUTTONS GIBT ES EINE NEUE GRUPPIERUNG (sie sollen nichts mit den Fahrzeug/Führerschein Dokumenten zutun haben)
const ICONS = {
    driversLicense: <FaIdCard />,
    carDocs: <FaCar />,
    notebook: <LuNotebook />
};

const LABELS = {
    driversLicense: "Führerschein",
    carDocs: "Fahrzeugpapiere",
    notebook: "Notebook",
};


export function DocumentBar({ activeDocs = [], openDocs, onSelect }) {

    if (activeDocs.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 flex gap-2 bg-white/90 p-2 rounded-xl shadow-lg border border-gray-300">
            {activeDocs.map(doc => {
                const isOpen = openDocs[doc];

                return (
                    <button
                    key={doc}
                    title={LABELS[doc] || doc}
                    onClick={() => onSelect(doc)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border text-xl transition
                        ${isOpen
                            ? "bg-blue-600 text-white border-blue-700"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }
                    `}
                >
                    {ICONS[doc]}
                </button>
                )
                
            })}
        </div>
    );
}