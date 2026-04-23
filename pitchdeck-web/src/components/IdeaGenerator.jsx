import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Dices } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';

const audiences = ["Dog Owners", "Dentists", "Gamers", "Indie Hackers", "Astronauts", "Students", "Grandparents", "Chefs"];
const problems = ["hate emails", "can't sleep", "lose their keys", "need networking", "want to save money", "struggle with diet"];
const solutions = ["using AI", "via a dating app format", "with Blockchain", "using VR glasses", "via SMS alerts", "using Drone delivery"];

export default function IdeaGenerator() {
    const [idea, setIdea] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);

    const spin = () => {
        setIsSpinning(true);
        setTimeout(() => {
            const aud = audiences[Math.floor(Math.random() * audiences.length)];
            const prob = problems[Math.floor(Math.random() * problems.length)];
            const sol = solutions[Math.floor(Math.random() * solutions.length)];
            setIdea(`An app for ${aud} who ${prob}, solved ${sol}.`);
            setIsSpinning(false);
        }, 600); // spin duration
    };

    return (
        <GlassCard className="relative overflow-hidden !border-pitch-accent/40 !bg-gradient-to-br !from-orange-50/90 !to-amber-100/90 !p-6 shadow-lg shadow-orange-500/10">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-pitch-accent/20 blur-2xl" />
            
            <div className="mb-4 flex items-center gap-2 text-stone-900">
                <Dices className="h-5 w-5 text-pitch-accent" />
                <h3 className="font-bold text-lg">Startup Roulette</h3>
            </div>
            
            <p className="mb-5 text-sm text-stone-600">
                Bored? Can't think of an idea? Spin the wheel for a wildly fascinating startup prompt.
            </p>

            <div className="mb-5 min-h-[80px] rounded-xl border border-orange-200/80 bg-white/60 p-4 shadow-inner flex items-center justify-center text-center">
                {isSpinning ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                    >
                        <Sparkles className="h-6 w-6 text-pitch-accent/60" />
                    </motion.div>
                ) : idea ? (
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="font-medium text-stone-800"
                    >
                        {idea}
                    </motion.p>
                ) : (
                    <span className="text-stone-400 italic text-sm">Hit spin to generate an idea...</span>
                )}
            </div>

            <button
                onClick={spin}
                disabled={isSpinning}
                className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-pitch-accent to-orange-500 px-4 py-3 font-bold text-white shadow-md shadow-orange-500/25 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-80"
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.1%22/%3E%3C/svg%3E')] opacity-30 mix-blend-overlay"></div>
                {isSpinning ? 'Spinning...' : 'Spin the Roulette'}
            </button>
        </GlassCard>
    );
}
