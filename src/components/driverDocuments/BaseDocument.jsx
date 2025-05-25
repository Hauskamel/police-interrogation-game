import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion";



export default function BaseDocument({ children }) {

    const [documentPosition, setDocumentPosition] = useState({x:0, y:0});
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState(null);
    const ref = useRef();

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        } else {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }, [dragging])


    function onMouseDown (e) {
        if (e.button !== 0) return // only left mouse button allowed

        const rect = ref.current.getBoundingClientRect()

        setDragging(true);
        setOffset({
            x: e.pageX - rect.left,
            y: e.pageY - rect.top
        });
        

        e.stopPropagation();
        e.preventDefault();
    }

     const onMouseUp = (e) => {
        setDragging(false);
        e.stopPropagation();
        e.preventDefault();
    };

    const onMouseMove = (e) => {
        if (!dragging) return;
        

        if (e.pageX < 0) return;
        if (e.pageY < 0) return;
        
        setDocumentPosition({
            x: e.pageX - offset.x, // set 'x' to x-coordinate of cursor
            y: e.pageY - offset.y  // set 'y' to y-coordinate of cursor
        });
        
        e.stopPropagation();
        e.preventDefault();
    };
    
    

    return (
        <div className="fixed top-8 left-8">
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
                                    left: `${documentPosition.x}px`,
                                    top: `${documentPosition.y}px`,
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
