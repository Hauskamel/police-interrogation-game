import { motion, AnimatePresence } from "framer-motion";

export default function AnimatedDocument({ isVisible, children }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed bottom-28 top-80 right-4 w-[450px] h-[250px]"
                    initial={{ opacity: 0, scale: 0.8, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
