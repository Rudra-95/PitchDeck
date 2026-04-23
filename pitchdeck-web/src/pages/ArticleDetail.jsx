import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckSquare, Square, ChevronLeft, Lightbulb, Rocket, Zap } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';

export default function ArticleDetail() {
    const { id } = useParams();
    const [checkedItems, setCheckedItems] = useState({});

    // Retrieve progress from local storage so it feels like a real persistent app
    useEffect(() => {
        const saved = localStorage.getItem(`playbook_${id}`);
        if (saved) {
            setCheckedItems(JSON.parse(saved));
        }
    }, [id]);

    const handleCheck = (taskId) => {
        const updated = { ...checkedItems, [taskId]: !checkedItems[taskId] };
        setCheckedItems(updated);
        localStorage.setItem(`playbook_${id}`, JSON.stringify(updated));
    };

    const completionCount = Object.values(checkedItems).filter(Boolean).length;
    const isCompleted = completionCount >= 3;

    return (
        <div className="mx-auto max-w-4xl pt-8 pb-32 px-4 relative z-10">
            <Link to="/playbook" className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-stone-500 hover:text-pitch-accent transition-colors mb-10 bg-white/50 px-4 py-2 rounded-full border border-stone-200/50 hover:bg-white shadow-sm">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Playbook
            </Link>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-widest border border-orange-200 mb-6 shadow-sm">
                    <Rocket className="h-3 w-3" /> Execution Guide
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-stone-900 tracking-tight leading-[1.1] mb-6 drop-shadow-sm">
                    How to validate your startup idea in <span className="text-pitch-accent">7 days</span>
                </h1>
                <p className="text-xl text-stone-600 font-medium leading-relaxed max-w-2xl">
                    Stop writing code. Treat your startup like an applied science experiment. Proceed only when the market forces you to via raw demand.
                </p>
            </motion.div>

            {/* Pro-tip Glass Panel */}
            <GlassCard className="mb-14 !p-6 md:!p-8 bg-gradient-to-br from-indigo-50/90 to-blue-50/90 border-indigo-200 shadow-md shadow-indigo-900/5 !rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 transition-transform group-hover:scale-110">
                    <Lightbulb className="h-32 w-32 text-indigo-600" />
                </div>
                <div className="flex items-start gap-4 relative z-10">
                    <div className="bg-indigo-100 p-3 rounded-2xl shrink-0 shadow-inner">
                        <Zap className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">The Golden Rule</h3>
                        <p className="text-indigo-800/80 font-medium leading-relaxed text-lg">
                            If they aren't willing to offer you their email, their time, or their money today, they won't use your app tomorrow.
                        </p>
                    </div>
                </div>
            </GlassCard>

            <div className="prose prose-lg prose-stone max-w-none mb-16">
                <h2 className="text-3xl font-bold text-stone-900 mb-4">The Danger of "Stealth Mode"</h2>
                <p className="text-stone-600 mb-8 font-medium">
                    Too many founders lock themselves in a dark room for 6 months building a V1, only to launch it to absolute silence. We are avoiding that completely. We will utilize the PitchDeck Validation Engine to gather raw, structured analytics on our core hypothesis before drawing a single UI mockup.
                </p>

                <h2 className="text-3xl font-bold text-stone-900 mb-6">Your 7-Day Checklist</h2>
                
                <div className="space-y-4">
                    {[
                        { id: '1', title: "Day 1: Define the Hyper-Specific Persona", detail: "Don't build for 'everyone'. Pick a niche so specific it hurts. E.g. 'Freelance graphic designers matching with Shopify e-commerce owners'." },
                        { id: '2', title: "Day 3: Write the PitchDeck Manifesto", detail: "Distill the problem, market size, and solution into a 4-sentence pitch. Avoid tech jargon. No one cares if it's AI or Blockchain; they care if it solves their pain." },
                        { id: '3', title: "Day 7: Launch to the Global Feed", detail: "Post it on PitchDeck. Watch the Community Validation Tracker. If you score > 40/50 in Market Need, start building." }
                    ].map((task) => (
                        <div 
                            key={task.id}
                            onClick={() => handleCheck(task.id)}
                            className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                                checkedItems[task.id] 
                                ? 'bg-emerald-50 border-emerald-200' 
                                : 'bg-white border-stone-200 hover:border-orange-300 hover:shadow-md'
                            }`}
                        >
                            <button className="shrink-0 mt-1 focus:outline-none">
                                {checkedItems[task.id] ? (
                                    <CheckSquare className="h-7 w-7 text-emerald-500" />
                                ) : (
                                    <Square className="h-7 w-7 text-stone-300" />
                                )}
                            </button>
                            <div>
                                <h4 className={`text-xl font-bold mb-2 transition-colors ${checkedItems[task.id] ? 'text-emerald-900 line-through opacity-70' : 'text-stone-900'}`}>
                                    {task.title}
                                </h4>
                                <p className={`font-medium leading-relaxed ${checkedItems[task.id] ? 'text-emerald-700/60' : 'text-stone-600'}`}>
                                    {task.detail}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Card at bottom */}
            {isCompleted && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 md:p-10 rounded-[2rem] bg-gradient-to-br from-pitch-accent to-orange-500 text-white text-center shadow-xl shadow-orange-500/20 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.1%22/%3E%3C/svg%3E')] opacity-30 mix-blend-overlay"></div>
                    <h3 className="text-3xl font-black mb-4 relative z-10">You're ready.</h3>
                    <p className="text-orange-100 font-medium text-lg mb-8 max-w-xl mx-auto relative z-10">
                        You've completed the validation framework. It's time to put your idea into the arena and gather raw metrics.
                    </p>
                    <Link to="/submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-black text-orange-600 shadow-xl transition-transform hover:scale-105 active:scale-95 relative z-10 hover:shadow-white/20 hover:-translate-y-1">
                        <Rocket className="h-5 w-5" /> Submit to Global Feed
                    </Link>
                </motion.div>
            )}
        </div>
    );
}
