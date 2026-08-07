// ##### Inspection Focus Overlay
// -----> Lässt beim Dokumentvergleich Laptop, Dokumente und Gesprächsbelege bedienbar.
// ---> Funkabfragen dunkeln den Laptop mit ab, weil nur Dokumentfelder erlaubt sind.
export function InspectionFocusOverlay({ laptopOpen, radioInquiryActive }) {
    return (
        <div
            className={`pointer-events-none fixed inset-0 ${
                laptopOpen && !radioInquiryActive ? "z-[7900]" : "z-[8500]"
            } bg-black/75 backdrop-blur-[1px]`}
            aria-hidden="true"
        />
    );
}
