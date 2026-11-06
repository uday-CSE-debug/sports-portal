'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

export default function SportsLoader() {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                {/* Outer pulsing ring */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                />

                {/* Central Icon */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative bg-white p-4 rounded-3xl shadow-premium border border-primary/5"
                >
                    <Trophy className="w-10 h-10 text-primary" />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40"
            >
                Ready for Victory...
            </motion.div>
        </div>
    );
}
