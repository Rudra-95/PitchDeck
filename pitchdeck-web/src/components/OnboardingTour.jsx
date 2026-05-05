import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function OnboardingTour() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState(null);

    const steps = [
        { target: 'nav-feed', content: 'Explore live pitches in the community.' },
        { target: 'nav-playbook', content: 'Read guides to build your startup.' },
        { target: 'nav-stress-test', content: 'Test your idea against our AI.' },
        { target: 'nav-founder-dna', content: 'Discover your founder personality.' },
        { target: 'nav-battle', content: 'Watch ideas clash in the arena.' },
        { target: 'nav-login', content: 'Log in to start your journey!' }
    ];

    useEffect(() => {
        const hasSeenTour = localStorage.getItem('hasSeenTour');
        if (!hasSeenTour) {
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (!isVisible || currentStep >= steps.length) return;

        const updatePosition = () => {
            const el = document.getElementById(steps[currentStep].target);
            const isVisibleEl = el && el.offsetWidth > 0 && el.offsetHeight > 0;
            
            if (isVisibleEl) {
                const rect = el.getBoundingClientRect();
                setTargetRect({
                    top: rect.bottom + 12, // Position slightly below the element
                    left: rect.left + rect.width / 2, // Center align
                });
            } else {
                // If element is not found/visible, skip to next step immediately
                setCurrentStep(prev => prev + 1);
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        // Auto-advance to the next step after 3.5 seconds
        const timer = setTimeout(() => {
            setCurrentStep(prev => prev + 1);
        }, 3500);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
            clearTimeout(timer);
        };
    }, [currentStep, isVisible]);

    useEffect(() => {
        if (currentStep >= steps.length && isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                localStorage.setItem('hasSeenTour', 'true');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentStep, isVisible, steps.length]);

    return (
        <AnimatePresence>
            {isVisible && currentStep < steps.length && targetRect && (
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 350, damping: 22 }}
                    className="fixed z-[9999] pointer-events-none drop-shadow-2xl"
                    style={{
                        top: targetRect.top,
                        left: targetRect.left,
                        x: "-50%" 
                    }}
                >
                    {/* The Cloud Body */}
                    <div className="relative bg-white/95 backdrop-blur-md text-stone-700 font-semibold text-sm px-5 py-3 rounded-2xl shadow-xl border border-orange-200/50 w-max max-w-[220px] text-center">
                        {/* The Short Tail (Arrow) pointing UP */}
                        <div className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white/95 drop-shadow-sm" />
                        <p className="leading-snug">{steps[currentStep].content}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
