import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../api';

export default function IdeaCard({ idea }) {
    const [votes, setVotes] = useState(idea.vote_count ?? 0);
    const [isVoting, setIsVoting] = useState(false);

    // Mock category coloration from the image
    const getCategoryColors = (cat) => {
        const c = String(cat).toLowerCase();
        if (c.includes('fintech')) return 'bg-blue-50 text-blue-600';
        if (c.includes('edtech')) return 'bg-emerald-50 text-emerald-600';
        if (c.includes('health')) return 'bg-fuchsia-50 text-fuchsia-600';
        if (c.includes('agri')) return 'bg-amber-50 text-amber-600';
        return 'bg-stone-100 text-stone-600';
    };

    const handleVote = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isVoting) return;
        setIsVoting(true);
        try {
            await api.post(`/ideas/${idea.id}/vote`);
            setVotes(v => v + 1); // Mock standard increment for UI testing
        } catch (error) {
            console.error("Failed to vote:", error);
            alert("Ensure you are logged in to upvote startups!");
        } finally {
            setIsVoting(false);
        }
    };

    const downvotes = Math.floor(votes * 0.15) || (idea.id % 10 + 2); // Mock downvotes for UI

    return (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
            <Link to={`/ideas/${idea.id}`} className="block flex-1">
                <div className="mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryColors(idea.category)}`}>
                        {idea.category || 'Tech'}
                    </span>
                </div>
                
                <h3 className="text-xl font-bold text-stone-900 mb-2 leading-tight">
                    {idea.title}
                </h3>
                
                <p className="text-stone-600 mb-6 line-clamp-3 font-medium">
                    {idea.description}
                </p>
            </Link>
            
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-transparent">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-500">
                     {idea.looking_for || 'Idea Stage'}
                </span>
                
                <div className="flex items-center gap-2">
                   <button 
                       onClick={handleVote}
                       disabled={isVoting}
                       className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 rounded-lg text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
                   >
                       {isVoting ? <Loader2 className="h-4 w-4 animate-spin text-stone-400" /> : <span>👍</span>}
                       {votes}
                   </button>
                   <button 
                       className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 rounded-lg text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-colors cursor-not-allowed opacity-80"
                   >
                       <span>👎</span> {downvotes}
                   </button>
                </div>
            </div>
        </div>
    );
}
