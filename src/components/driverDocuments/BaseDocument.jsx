import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion";
import { useDraggable } from "../../hooks/useDraggable";



export default function BaseDocument({ children }) {

    const { ref, position, onMouseDown } = useDraggable({x: 32, y: 32})



    return (
        <div className="fixed top-0 left-0">
            <AnimatePresence>   
                {React.Children.map(children, (child) =>
                        child ? (
                            <motion.div
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
                                {child}
                            </motion.div>
                        ) : null
                    )}
                
            </AnimatePresence>
        </div>
    );
}
