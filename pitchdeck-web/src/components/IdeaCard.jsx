import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mail, ThumbsUp, User } from 'lucide-react';
import api from '../api';

export default function IdeaCard({ idea }) {
    const [votes, setVotes] = useState(idea.vote_count ?? 0);
    const [isVoting, setIsVoting] = useState(false);

    // Mock category coloration from the image
    const getCategoryColors = (cat) => {
        const c = String(cat).toLowerCase();
        if (c.includes('fintech')) return 'bg-blue-50 text-blue-600 border-blue-100';
        if (c.includes('edtech')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (c.includes('health')) return 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100';
        if (c.includes('agri')) return 'bg-amber-50 text-amber-600 border-amber-100';
        return 'bg-stone-50 text-stone-600 border-stone-200';
    };

    const handleVote = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isVoting) return;
        setIsVoting(true);
        try {
            const res = await api.post(`/ideas/${idea.id}/vote`);
            if (res.data && typeof res.data.vote_count !== 'undefined') {
                setVotes(res.data.vote_count);
            }
        } catch (error) {
            console.error("Failed to vote:", error);
            alert("Ensure you are logged in to upvote startups!");
        } finally {
            setIsVoting(false);
        }
    };

    const handleConnect = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!idea.author_email) {
            alert("This founder hasn't provided an email.");
            return;
        }
        window.location.href = `mailto:${idea.author_email}?subject=Let's connect regarding your PitchDeck idea: ${encodeURIComponent(idea.title)}`;
    };

    return (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col h-full hover:shadow-lg transition-all duration-300 group">
            <Link to={`/ideas/${idea.id}`} className="block flex-1">
                <div className="mb-4 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${getCategoryColors(idea.category)}`}>
                        {idea.category || 'Tech'}
                    </span>
                    {idea.author_name && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500">
                            <User className="h-3 w-3" /> {idea.author_name}
                        </div>
                    )}
                </div>
                
                <h3 className="text-xl font-extrabold text-stone-900 mb-2 leading-tight group-hover:text-pitch-accent transition-colors">
                    {idea.title}
                </h3>
                
                <p className="text-stone-600 mb-6 line-clamp-3 font-medium text-[15px] leading-relaxed">
                    {idea.description}
                </p>
            </Link>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Looking for</span>
                    <span className="text-sm font-semibold text-stone-700">
                        {idea.looking_for || 'Idea Stage Validation'}
                    </span>
                </div>
                
                <div className="flex items-center gap-2">
                   <button 
                       onClick={handleConnect}
                       className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-sm font-semibold text-stone-700 transition-colors"
                       title="Connect with founder"
                   >
                       <Mail className="h-4 w-4" />
                       <span className="hidden sm:inline">Connect</span>
                   </button>
                   <button 
                       onClick={handleVote}
                       disabled={isVoting}
                       className="flex items-center gap-1.5 px-3 py-2 border border-orange-200 bg-orange-50 hover:bg-orange-100 rounded-lg text-sm font-bold text-orange-700 transition-colors shadow-sm"
                   >
                       {isVoting ? <Loader2 className="h-4 w-4 animate-spin text-orange-500" /> : <ThumbsUp className="h-4 w-4" />}
                       {votes}
                   </button>
                </div>
            </div>
        </div>
    );
}
