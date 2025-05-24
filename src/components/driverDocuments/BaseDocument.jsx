import React, { useState, useRef, useEffect } from "react"

import { motion, AnimatePresence } from "framer-motion";



export default function BaseDocument({ children }) {

    const [pos, setPos] = useState({x:0, y:0});
    const [dragging, setDragging] = useState(false);
    const [rel, setRel] = useState(null);
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
        setRel({
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
        
        setPos({
            x: e.pageX,
            y: e.pageY
        });
        

        e.stopPropagation();
        e.preventDefault();
    };


    console.log(children);
    
    

    return (
        <div className="fixed top-0 ">
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
                                    left: `${pos.x}px`,
                                    top: `${pos.y}px`,
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
