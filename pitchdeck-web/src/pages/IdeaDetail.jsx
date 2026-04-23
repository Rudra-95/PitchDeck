import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, UserPlus, ShieldCheck, MessageSquare, Loader2, CheckCircle2, Crown } from 'lucide-react';
import api from '../api';
import FeedbackForm from '../components/FeedbackForm';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';

export default function IdeaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('pitchdeck_token');
    
    // Check if we just came back from a successful checkout
    const checkoutSuccessMsg = location.state?.message;

    const [voteStatus, setVoteStatus] = useState('');

    const { data: idea, refetch: refetchIdea } = useQuery({
        queryKey: ['idea', id],
        queryFn: async () => (await api.get(`/ideas/${id}`)).data,
    });
    const { data: feedbackList, refetch: refetchFeedback } = useQuery({
        queryKey: ['feedback', id],
        queryFn: async () => (await api.get(`/ideas/${id}/feedback`)).data,
    });

    const handleVote = async () => {
        if (!token) {
            setVoteStatus('Login required to vote');
            return;
        }
        try {
            await api.post(`/ideas/${id}/vote`);
            setVoteStatus('Vote registered successfully');
            refetchIdea();
        } catch (error) {
            setVoteStatus(error.response?.data?.error || 'Error voting');
        }
    };

    const handleMentorCheckout = () => {
        if (!token) {
            setVoteStatus('Login required to request mentor review.');
            return;
        }
        navigate('/checkout', { 
            state: { 
                title: 'Expert Mentor Review', 
                price: '19.99', 
                ideaId: id,
                type: 'mentor',
                description: 'Get a comprehensive, brutal written breakdown of your startup idea by a verified ex-YCombinator founder.'
            } 
        });
    };

    const handleFeatureCheckout = () => {
        if (!token) {
            setVoteStatus('Login required to feature this idea.');
            return;
        }
        navigate('/checkout', { 
            state: { 
                title: 'Featured Placement', 
                price: '9.99', 
                ideaId: id,
                type: 'promote',
                description: 'Lock your idea to the very top of the global feed for 24 hours, guaranteeing you 10x the traffic and validation.'
            } 
        });
    };

    if (!idea)
        return (
            <div className="flex justify-center pt-24">
                <div className="h-12 w-12 animate-spin rounded-full border-[4px] border-orange-400 border-t-transparent shadow-lg" />
            </div>
        );

    return (
        <div className="mx-auto max-w-5xl pt-8 pb-20">
            {checkoutSuccessMsg && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-300/80 bg-emerald-50/90 px-6 py-4 text-emerald-900 shadow-md">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    <span className="font-bold text-lg">{checkoutSuccessMsg}</span>
                </div>
            )}

            <GlassCard animate={true} className="relative mb-12 !overflow-visible !p-8 md:!p-12 border-orange-300/50 shadow-xl shadow-orange-900/5">
                <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-orange-300/30 blur-[100px]" />

                <div className="mb-8 flex items-start justify-between relative z-10">
                    <Badge variant="indigo" className="px-4 py-2 text-sm shadow-sm border border-indigo-200">
                        {idea.category || 'Tech'}
                    </Badge>
                    <button
                        type="button"
                        onClick={handleVote}
                        className="flex items-center gap-2 rounded-2xl border border-rose-200/90 bg-rose-50 px-5 py-2.5 font-black text-rose-700 shadow-md transition-all duration-300 hover:scale-[1.03] hover:bg-rose-100 hover:shadow-rose-500/20 active:scale-95"
                    >
                        <Heart className="h-6 w-6 fill-rose-500 stroke-[1.5]" /> {idea.vote_count || 0}
                    </button>
                </div>

                <h1 className="mb-6 text-4xl font-extrabold leading-tight text-stone-900 md:text-6xl drop-shadow-sm relative z-10">{idea.title}</h1>
                <p className="mb-10 text-xl leading-relaxed text-stone-600 font-medium relative z-10">{idea.description}</p>

                {voteStatus ? <p className="mb-4 text-sm font-semibold text-rose-700">{voteStatus}</p> : null}

                <div className="flex flex-col sm:flex-row flex-wrap gap-4 border-t border-orange-200/70 pt-8 relative z-10">
                    {idea.looking_for ? (
                        <div className="flex items-center gap-2 rounded-xl border border-orange-200/80 bg-orange-50/80 px-4 py-3 font-bold text-orange-950 shadow-sm">
                            <UserPlus className="h-5 w-5 text-pitch-accent" /> Seeking: {idea.looking_for}
                        </div>
                    ) : null}

                    <div className="flex flex-1 flex-col sm:flex-row justify-end gap-3 w-full">
                        <button
                            type="button"
                            onClick={handleFeatureCheckout}
                            className="flex items-center justify-center gap-2 rounded-xl border border-amber-300/90 bg-gradient-to-r from-amber-100 to-amber-50 px-5 py-3 font-bold text-amber-900 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/20 active:scale-95 whitespace-nowrap"
                        >
                            <Crown className="h-5 w-5 text-amber-600" />
                            Feature Idea ($9.99)
                        </button>

                        <button
                            type="button"
                            onClick={handleMentorCheckout}
                            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-300/90 bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-3 font-bold text-emerald-900 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
                        >
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            Mentor Review ($19.99)
                        </button>
                    </div>
                </div>
            </GlassCard>

            <div className="grid gap-12 lg:grid-cols-2">
                <div>
                    <h2 className="mb-8 flex items-center gap-3 text-3xl font-extrabold text-stone-900 drop-shadow-sm">
                        <MessageSquare className="h-8 w-8 text-pitch-accent" /> Community feedback
                    </h2>
                    <div className="space-y-6 lg:pr-4">
                        {feedbackList?.length === 0 ? (
                            <GlassCard className="!border-dashed !border-stone-300 py-16 text-center shadow-inner !bg-stone-50/50">
                                <p className="text-lg font-medium text-stone-500">No feedback yet. Be the first to validate!</p>
                            </GlassCard>
                        ) : null}
                        {feedbackList?.map((fb, idx) => (
                            <GlassCard
                                hoverEffect={true}
                                animate={true}
                                delay={idx * 0.1}
                                key={idx}
                                className="!bg-white/90 !p-6 shadow-md border-stone-200"
                            >
                                <div className="mb-5 flex items-center justify-between border-b border-stone-100 pb-4">
                                    <span className="font-extrabold text-lg text-stone-900">{fb.user_name || 'Anonymous'}</span>
                                    <Badge variant="default" className="text-xs font-bold bg-stone-100 text-stone-500 border-stone-200">
                                        {new Date(fb.created_at).toLocaleDateString()}
                                    </Badge>
                                </div>
                                <div className="mb-5 grid grid-cols-2 gap-4 text-sm font-semibold">
                                    <div className="flex justify-between text-stone-600 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100">
                                        Clarity:
                                        <span className="font-mono font-black text-indigo-700">{fb.structured_data.problem_clarity}/10</span>
                                    </div>
                                    <div className="flex justify-between text-stone-600 bg-fuchsia-50/50 p-2 rounded-lg border border-fuchsia-100">
                                        Market:
                                        <span className="font-mono font-black text-fuchsia-700">{fb.structured_data.market_size}/10</span>
                                    </div>
                                    <div className="flex justify-between text-stone-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                                        Unique:
                                        <span className="font-mono font-black text-emerald-700">{fb.structured_data.uniqueness}/10</span>
                                    </div>
                                    <div className="flex justify-between text-stone-600 bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                                        Solution:
                                        <span className="font-mono font-black text-amber-700">{fb.structured_data.solution_quality}/10</span>
                                    </div>
                                </div>
                                <p className="pt-3 italic text-stone-700 font-medium leading-relaxed border-t border-stone-100 border-dashed relative">
                                    <span className="absolute -top-3 left-4 bg-white px-2 text-stone-400 text-xs">Conclusion</span>
                                    "{fb.structured_data.comments}"
                                </p>
                            </GlassCard>
                        ))}
                    </div>
                </div>

                <div className="sticky top-28">
                    <FeedbackForm ideaId={id} onSuccess={refetchFeedback} />
                </div>
            </div>
        </div>
    );
}
