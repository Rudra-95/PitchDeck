import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, UserPlus, ShieldCheck, MessageSquare, Loader2, CheckCircle2, Crown, User, Mail, X, Send } from 'lucide-react';
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
    const [isConnectOpen, setIsConnectOpen] = useState(false);
    const [connectMessage, setConnectMessage] = useState('');
    const [connectSent, setConnectSent] = useState(false);

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

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!connectMessage.trim()) return;
        
        // Use mailto as a fallback if the user wants to actually send an email
        if (idea?.author_email) {
            window.location.href = `mailto:${idea.author_email}?subject=PitchDeck Connection: ${encodeURIComponent(idea.title)}&body=${encodeURIComponent(connectMessage)}`;
        }
        setConnectSent(true);
        setTimeout(() => {
            setIsConnectOpen(false);
            setConnectSent(false);
            setConnectMessage('');
        }, 2000);
    };

    const renderFormattedText = (text) => {
        if (!text) return null;
        // Add newlines before bold markers if they don't have them
        let processed = text.replace(/(\*\*.*?\*\*)/g, '\n$1');
        // Clean up double newlines
        processed = processed.replace(/\n\n+/g, '\n');
        
        return processed.split('\n').map((line, i) => {
            if (!line.trim()) return null;
            
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={i} className="mb-4 last:mb-0">
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <span key={j} className="font-extrabold text-stone-900 tracking-tight">{part.slice(2, -2)}</span>;
                        }
                        return <span key={j}>{part}</span>;
                    })}
                </p>
            );
        });
    };

    if (!idea)
        return (
            <div className="flex justify-center pt-24">
                <div className="h-12 w-12 animate-spin rounded-full border-[4px] border-orange-400 border-t-transparent shadow-lg" />
            </div>
        );

    return (
        <div className="mx-auto max-w-5xl pt-8 pb-20 relative">
            {checkoutSuccessMsg && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-300/80 bg-emerald-50/90 px-6 py-4 text-emerald-900 shadow-md">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    <span className="font-bold text-lg">{checkoutSuccessMsg}</span>
                </div>
            )}

            {/* Slide-out Connect Panel */}
            <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl border-l border-stone-200 z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isConnectOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                            <Mail className="h-5 w-5 text-pitch-accent" /> Connect
                        </h3>
                        <button onClick={() => setIsConnectOpen(false)} className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <div className="mb-6 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                        <p className="text-sm font-medium text-stone-700">You are initiating a connection with <span className="font-bold text-stone-900">{idea.author_name || 'the founder'}</span> regarding <span className="italic">{idea.title}</span>.</p>
                    </div>

                    {connectSent ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                            <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h4 className="text-xl font-bold text-stone-900 mb-2">Message Sent!</h4>
                            <p className="text-stone-500 text-sm mb-4">Your email client has been opened to send this to the founder.</p>
                            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 w-full">
                                <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider mb-1">Founder's Email (Fallback)</p>
                                <p className="text-sm font-mono text-stone-700 select-all">{idea.author_email || 'Not provided'}</p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSendMessage} className="flex-1 flex flex-col">
                            <label className="text-sm font-semibold text-stone-700 mb-2">Your Message</label>
                            <textarea
                                value={connectMessage}
                                onChange={(e) => setConnectMessage(e.target.value)}
                                placeholder={`Hi ${idea.author_name || 'there'}, I'd love to connect about your idea...`}
                                className="w-full flex-1 rounded-xl border border-stone-200 p-4 text-stone-700 focus:border-pitch-accent focus:ring-2 focus:ring-orange-200 outline-none resize-none mb-4"
                                required
                            />
                            <button type="submit" className="w-full bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-xl py-4 font-bold shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2">
                                <Send className="h-5 w-5" /> Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Overlay for slide-out */}
            {isConnectOpen && (
                <div onClick={() => setIsConnectOpen(false)} className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-40 animate-in fade-in duration-300" />
            )}

            <GlassCard animate={true} className="relative mb-12 !overflow-visible !p-8 md:!p-12 border-orange-300/50 shadow-xl shadow-orange-900/5">
                <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-orange-300/30 blur-[100px]" />

                <div className="mb-8 flex items-start justify-between relative z-10">
                    <div className="flex flex-col gap-3">
                        <Badge variant="indigo" className="px-4 py-2 text-sm shadow-sm border border-indigo-200 w-fit">
                            {idea.category || 'Tech'}
                        </Badge>
                        {idea.author_name && (
                            <div className="flex items-center gap-2 text-sm font-semibold text-stone-500">
                                <User className="h-4 w-4" /> Pitched by <span className="text-stone-800">{idea.author_name}</span>
                            </div>
                        )}
                    </div>
                    
                    <button
                        type="button"
                        onClick={handleVote}
                        className="flex items-center gap-2 rounded-2xl border border-rose-200/90 bg-rose-50 px-5 py-2.5 font-black text-rose-700 shadow-md transition-all duration-300 hover:scale-[1.03] hover:bg-rose-100 hover:shadow-rose-500/20 active:scale-95"
                    >
                        <Heart className="h-6 w-6 fill-rose-500 stroke-[1.5]" /> {idea.vote_count || 0}
                    </button>
                </div>

                <h1 className="mb-8 text-4xl font-extrabold leading-tight text-stone-900 md:text-5xl drop-shadow-sm relative z-10">{idea.title}</h1>
                <div className="mb-10 text-[1.1rem] leading-[1.8] text-stone-600 font-medium relative z-10">
                    {renderFormattedText(idea.description)}
                </div>

                {voteStatus ? <p className="mb-4 text-sm font-semibold text-rose-700">{voteStatus}</p> : null}

                <div className="flex flex-col lg:flex-row flex-wrap gap-4 border-t border-orange-200/70 pt-8 relative z-10 lg:items-center">
                    {idea.looking_for ? (
                        <div className="flex items-center gap-2 rounded-xl border border-orange-200/80 bg-orange-50/80 px-4 py-2.5 font-bold text-orange-950 shadow-sm whitespace-nowrap text-sm">
                            <UserPlus className="h-4 w-4 text-pitch-accent" /> Seeking: {idea.looking_for}
                        </div>
                    ) : null}

                    <div className="flex flex-1 flex-wrap lg:justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsConnectOpen(true)}
                            className="flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-stone-50 whitespace-nowrap"
                        >
                            <Mail className="h-4 w-4 text-stone-500" />
                            Connect
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleFeatureCheckout}
                            className="flex items-center justify-center gap-2 rounded-xl border border-amber-300/90 bg-gradient-to-r from-amber-100 to-amber-50 px-4 py-2.5 text-sm font-bold text-amber-900 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-amber-500/20 active:scale-95 whitespace-nowrap"
                        >
                            <Crown className="h-4 w-4 text-amber-600" />
                            Feature Idea
                        </button>

                        <button
                            type="button"
                            onClick={handleMentorCheckout}
                            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-300/90 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2.5 text-sm font-bold text-emerald-900 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
                        >
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            Mentor Review
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
