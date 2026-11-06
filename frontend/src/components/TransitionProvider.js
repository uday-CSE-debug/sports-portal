'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function TransitionProvider({ children }) {
    const pathname = usePathname();

    const variants = {
        hidden: { opacity: 0, x: -20 },
        enter: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial="hidden"
                animate="enter"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
