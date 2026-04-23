import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HintTooltip({ children, text, position = 'top' }) {
    const [isVisible, setIsVisible] = useState(false);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2.5',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2.5',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2.5',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2.5'
    };

    return (
        <div 
            className="relative flex items-center justify-center cursor-help"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 4 : position === 'bottom' ? -4 : 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
                        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                        className={`absolute z-[100] ${positions[position]} w-max max-w-[200px] text-center px-3 py-2 text-[11px] uppercase tracking-wider font-bold text-orange-950 bg-gradient-to-br from-amber-100 to-orange-200 border border-orange-300 rounded-lg shadow-xl shadow-orange-900/10 pointer-events-none`}
                    >
                        {text}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
