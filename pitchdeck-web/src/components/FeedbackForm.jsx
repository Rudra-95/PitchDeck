import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import api from '../api';

export default function FeedbackForm({ ideaId, onSuccess }) {
    const [scores, setScores] = useState({ problem_clarity: 5, market_size: 5, uniqueness: 5, solution_quality: 5 });
    const [comments, setComments] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const labels = {
        problem_clarity: 'Problem clarity',
        market_size: 'Market size & potential',
        uniqueness: 'Uniqueness & differentiation',
        solution_quality: 'Solution quality',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post(`/ideas/${ideaId}/feedback`, { ...scores, comments });
            setScores({ problem_clarity: 5, market_size: 5, uniqueness: 5, solution_quality: 5 });
            setComments('');
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Failed to submit feedback. Ensure you are logged in.');
        }
        setIsSubmitting(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative overflow-hidden rounded-2xl p-8"
        >
            <div className="pointer-events-none absolute right-[-20%] top-[-40%] h-[130%] w-[55%] rounded-full bg-orange-200/40 blur-[70px]" />

            <h3 className="relative z-10 mb-6 text-2xl font-bold">
                <span className="bg-gradient-to-r from-pitch-accent to-amber-600 bg-clip-text text-transparent">Validate this idea</span>
            </h3>

            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {Object.keys(scores).map((key) => (
                        <div key={key} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="font-semibold text-stone-700">{labels[key]}</label>
                                <span className="rounded border border-orange-200/90 bg-orange-50 px-2 py-0.5 font-mono text-sm font-bold text-pitch-accent">
                                    {scores[key]} / 10
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={scores[key]}
                                onChange={(e) => setScores({ ...scores, [key]: parseInt(e.target.value, 10) })}
                                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-orange-200/80 accent-pitch-accent"
                            />
                            <div className="flex justify-between text-xs text-stone-500">
                                <span>Weak</span>
                                <span>Strong</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <label className="mb-3 block font-semibold text-stone-700">Qualitative feedback</label>
                    <textarea
                        required
                        rows="4"
                        placeholder="What are the biggest risks? How can they improve?"
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="w-full resize-none rounded-xl border border-orange-200/90 bg-white p-4 text-stone-900 placeholder:text-stone-400 transition-all focus:border-pitch-accent focus:outline-none focus:ring-2 focus:ring-orange-200"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        disabled={isSubmitting}
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pitch-accent to-orange-600 px-8 py-3 font-bold text-white shadow-[0_6px_24px_-4px_rgba(234,88,12,0.45)] transition-all duration-300 hover:brightness-105 hover:shadow-[0_8px_28px_-4px_rgba(234,88,12,0.5)] disabled:scale-100 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            'Submitting...'
                        ) : (
                            <>
                                <Send className="h-5 w-5" /> Submit validation
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
