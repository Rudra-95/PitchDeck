import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, TrendingUp, ChevronRight, Briefcase, Eye, Target, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function InvestorPortal() {
    const [ideas, setIdeas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch all ideas but sort them strictly by validation tracking for investors
        api.get('/ideas', { params: { sort: 'trending' } })
            .then(res => {
                setIdeas(res.data || []);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-stone-950 text-stone-300 w-full absolute top-0 left-0 z-50 overflow-y-auto">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-xl border-b border-stone-800/80">
                <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <Briefcase className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="font-bold text-white tracking-wide">PitchDeck <span className="font-light text-stone-500">|</span> <span className="text-emerald-400">Capital</span></h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-stone-500 bg-stone-900 px-3 py-1.5 rounded-full border border-stone-800">
                            <Lock className="h-3 w-3" /> Secure Deal Flow
                        </span>
                        <Link to="/" className="text-sm font-medium text-stone-400 hover:text-white transition-colors">Exit Portal</Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-12">
                <div className="mb-12">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight mb-3">Verified Investor Dashboard</h2>
                    <p className="text-stone-400 text-lg max-w-2xl">
                        Exclusive real-time access to the highest-validated startups on the platform. Sort by traction, view community feedback securely, and initiate direct messages with founders.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="col-span-1 lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Target className="h-5 w-5 text-emerald-500" /> High-Traction Opportunities
                            </h3>
                            <div className="text-sm text-stone-500">Sorted by Validation Percentile</div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-20 border border-stone-800/50 rounded-2xl bg-stone-900/20">
                                <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {ideas.map((idea, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={idea.id} 
                                        className="group flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl border border-stone-800 bg-stone-900/40 hover:bg-stone-900 transition-colors"
                                    >
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-stone-800 border border-stone-700 text-emerald-400 font-bold text-xl relative overflow-hidden">
                                            {idx < 3 && <div className="absolute inset-0 bg-emerald-400/10" />}
                                            #{idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-xl font-bold text-white">{idea.title}</h4>
                                                {idx === 0 && <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-emerald-500/30">Top Pick</span>}
                                            </div>
                                            <p className="text-sm text-stone-400 line-clamp-1">{idea.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-stone-300 flex items-center justify-end gap-1"><TrendingUp className="h-4 w-4 text-emerald-500" /> {idea.vote_count || 0} pts</div>
                                                <div className="text-[11px] uppercase tracking-wider text-stone-500 text-right">{idea.category}</div>
                                            </div>
                                            <Link to={`/ideas/${idea.id}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 text-stone-400 hover:bg-emerald-500 hover:text-white transition-colors">
                                                <ChevronRight className="h-5 w-5" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="col-span-1">
                        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 sticky top-28">
                            <h3 className="text-lg font-bold text-white mb-4">Investor Tools</h3>
                            <div className="space-y-3">
                                <button className="w-full text-left p-4 rounded-xl border border-stone-800 bg-stone-950/50 hover:border-emerald-500/30 transition-colors group">
                                    <div className="font-bold text-stone-300 group-hover:text-emerald-400 mb-1 transition-colors">Direct Messaging (Deal Flow)</div>
                                    <div className="text-xs text-stone-500">Initiate WebSockets chat with startup founders directly using the bottom-right widget.</div>
                                </button>
                                <button className="w-full text-left p-4 rounded-xl border border-stone-800 bg-stone-950/50 hover:border-emerald-500/30 transition-colors group">
                                    <div className="font-bold text-stone-300 group-hover:text-emerald-400 mb-1 transition-colors">Due Diligence Docs</div>
                                    <div className="text-xs text-stone-500">Request deep dive analytics and cap tables automatically.</div>
                                </button>
                                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 text-emerald-400 text-sm">
                                    <Sparkles className="h-4 w-4 mb-2" />
                                    Your verified investor status grants you priority access to founders 48 hours before public funding rounds open.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
