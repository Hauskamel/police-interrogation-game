import { FaIdCard, FaCar } from "react-icons/fa";

const ICONS = {
    driverLicense: <FaIdCard />,
    carDocs: <FaCar />,
};

const LABELS = {
    driverLicense: "DL",
    carDocs: "CAR",
    idCard: "ID",
};

function DocumentDock({ activeDocs = [], currentDoc, onSelect }) {
    if (activeDocs.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 flex gap-2 bg-white/90 p-2 rounded-xl shadow-lg border border-gray-300">
            {activeDocs.map((doc) => (
                <button
                    key={doc}
                    title={LABELS[doc] || doc}
                    onClick={() => onSelect(doc)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border text-xl transition
            ${
                        currentDoc === doc
                            ? "bg-blue-600 text-white border-blue-700"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                    {ICONS[doc] || <FaFileAlt />}
                </button>
            ))}
        </div>
    );
}

export { DocumentDock }