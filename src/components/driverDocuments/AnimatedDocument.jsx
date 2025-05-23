import * as React from "react"

import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedDocument({ children }) {

    return (
        <div className="fixed top-80 right-10">
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
                            >
                                {child}
                            </motion.div>
                        ) : null
                    )}
                
            </AnimatePresence>
        </div>
    );
}
