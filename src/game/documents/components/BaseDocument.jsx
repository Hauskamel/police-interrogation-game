import React, { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion";
import { FaXmark } from "react-icons/fa6";
import { useDraggable } from "../hooks";

import { useGuiVisibilityStatesStore } from "@stores";

const MotionDiv = motion.div;


/**
 * ##### Base Document
 * -----> Beweglicher Rahmen fuer geöffnete Dokumente wie Führerschein oder Versicherung.
 */
export default function BaseDocument({ children, onClose }) {
    const { ref, position, onMouseDown } = useDraggable({x: 32, y: 32});

    const setDocumentsAreVisible = useGuiVisibilityStatesStore(state => state.setDocumentVisibilityState)
    const documentsAreVisible = useGuiVisibilityStatesStore(state => state.documentsVisible);

    useEffect(()=>{
        setDocumentsAreVisible(true)        
    }, [setDocumentsAreVisible]);

    return (
        <div className={`fixed top-0 left-0 ${documentsAreVisible ? 'animate-fade-in' : 'animate-fade-out'}`}>
            <AnimatePresence>   
                {React.Children.map(children, (child) =>
                        child ? (
                            <MotionDiv
                                key={child.key} // ensure key is passed
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full h-full"
                                ref={ref}
                                onMouseDown={onMouseDown}
                                style={{
                                    position: 'absolute',
                                    left: `${position.x}px`,
                                    top: `${position.y}px`,
                                    cursor: 'move'
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
                        ) : null
                    )};
                
            </AnimatePresence>
        </div>
    );
};
