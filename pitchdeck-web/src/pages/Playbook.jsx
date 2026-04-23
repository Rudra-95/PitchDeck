import { motion } from 'framer-motion';
import { BookOpen, Rocket, Users, BadgeDollarSign, ChevronRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';

const guides = [
    {
        id: 'validate-7-days',
        title: "How to validate your startup idea in 7 days",
        description: "Stop building in the dark. A tactical, step-by-step framework to guarantee market demand before you write a single line of code.",
        icon: Rocket,
        color: "text-pitch-accent",
        bgIcon: "bg-orange-100",
        readTime: "8 min read",
        isPopular: true
    },
    {
        id: 'finding-technical-cofounder',
        title: "The unfair advantage to finding a Technical Co-founder",
        description: "They get pitched 100 times a day. Learn exactly how to stand out and attract top engineering talent to your vision.",
        icon: Users,
        color: "text-indigo-600",
        bgIcon: "bg-indigo-100",
        readTime: "5 min read",
        isPopular: false
    },
    {
        id: 'anatomy-of-preseed-deck',
        title: "Anatomy of a winning Pre-Seed Pitch Deck",
        description: "Tear-down of the exact slides and psychological triggers that get Angels to pull the trigger on a $500k check.",
        icon: BadgeDollarSign,
        color: "text-emerald-600",
        bgIcon: "bg-emerald-100",
        readTime: "12 min read",
        isPopular: false
    }
];

export default function Playbook() {
    return (
        <div className="mx-auto max-w-6xl pt-8 pb-20 px-4">
            <div className="mb-16 text-center max-w-3xl mx-auto relative z-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-6 inline-flex rounded-[2rem] border border-orange-200/90 bg-gradient-to-br from-white to-orange-50/80 p-6 shadow-xl shadow-orange-500/10 backdrop-blur-md"
                >
                    <BookOpen className="h-16 w-16 text-pitch-accent drop-shadow-md" strokeWidth={1.5} />
                </motion.div>
                <h1 className="mb-5 text-5xl font-black tracking-tight text-stone-900 md:text-7xl drop-shadow-sm">
                    The Founder <span className="text-pitch-accent">Playbook</span>
                </h1>
                <p className="text-xl text-stone-600 font-medium leading-relaxed">
                    Reddit is too global, LinkedIn is too formal. Welcome to your <strong className="text-stone-800">tactical</strong> startup execution engine. Highly structured, brutally honest guides.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 relative z-10 w-full">
                {guides.map((guide, idx) => {
                    const Icon = guide.icon;
                    return (
                        <Link to={`/playbook/${guide.id}`} key={guide.id} className="group block h-full">
                            <GlassCard
                                hoverEffect
                                animate
                                delay={idx * 0.1}
                                className="flex h-full flex-col !p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 border-stone-200/80 group-hover:border-orange-300/80 bg-white/70"
                            >
                                <div className="mb-6 flex justify-between items-start">
                                    <div className={`p-4 rounded-2xl ${guide.bgIcon} shadow-inner`}>
                                        <Icon className={`h-8 w-8 ${guide.color}`} />
                                    </div>
                                    {guide.isPopular && (
                                        <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-orange-700 bg-orange-100 border border-orange-200 rounded-full px-3 py-1.5 shadow-sm">
                                            🔥 Popular
                                        </span>
                                    )}
                                </div>

                                <h3 className="mb-4 text-2xl font-extrabold text-stone-900 group-hover:text-pitch-accent transition-colors leading-tight">
                                    {guide.title}
                                </h3>
                                <p className="mb-8 flex-1 text-stone-600 font-medium leading-relaxed">
                                    {guide.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between border-t border-stone-200/60 pt-5">
                                    <span className="flex items-center text-xs font-bold uppercase tracking-widest text-stone-500">
                                        <Bookmark className="h-3 w-3 mr-1.5" /> {guide.readTime}
                                    </span>
                                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-stone-100 group-hover:bg-pitch-accent transition-colors">
                                        <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-white" />
                                    </div>
                                </div>
                            </GlassCard>
                        </Link>
                    );
                })}
            </div>
            
            <div className="mt-16 relative z-10 text-center">
                <div className="inline-block px-8 py-5 rounded-3xl border border-stone-200/80 bg-white/60 shadow-lg backdrop-blur-xl">
                    <p className="font-bold text-stone-700">More tactical playbooks dropping every Tuesday.</p>
                </div>
            </div>
        </div>
    );
}
