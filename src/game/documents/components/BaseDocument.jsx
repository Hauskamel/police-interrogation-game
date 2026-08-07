import React from "react";
import { motion } from "framer-motion";
import { FaXmark } from "react-icons/fa6";
import { useDraggable } from "../hooks";

const MotionDiv = motion.div;


/**
 * ##### Base Document
 * -----> Beweglicher Rahmen fuer geöffnete Dokumente wie Führerschein oder Versicherung.
 */
export default function BaseDocument({
    children,
    documentType,
    onClose,
    discrepancyModeActive = false
}) {
    const { ref, position, onMouseDown } = useDraggable({x: 32, y: 32});

    return (
        <div
            className={`fixed left-0 top-0 z-[9000] ${discrepancyModeActive ? "drop-shadow-[0_0_16px_rgba(96,165,250,0.55)]" : ""}`}
            data-document-type={documentType}
        >
            {React.Children.map(children, (child) => child ? (
                <MotionDiv
                    key={child.key}
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full w-full"
                    ref={ref}
                    onMouseDown={onMouseDown}
                    style={{
                        position: "absolute",
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        cursor: "move"
                    }}
                >
                    <button
                        type="button"
                        className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900/85 text-white shadow hover:bg-zinc-800"
                        aria-label="Dokument schließen"
                        onMouseDown={(event) => event.stopPropagation()}
                        onClick={onClose}
                    >
                        <FaXmark aria-hidden="true" />
                    </button>
                    {child}
                </MotionDiv>
            ) : null)}
        </div>
    );
}
