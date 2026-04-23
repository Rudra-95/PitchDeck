import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Leaderboard() {
    const { data: leaderboard, isLoading } = useQuery({
        queryKey: ['leaderboard'],
        queryFn: async () => (await api.get('/leaderboard/weekly')).data,
    });

    const topTen = leaderboard?.slice(0, 10) || [];

    return (
        <div className="mx-auto max-w-4xl pt-12 pb-20 px-4">
            <div className="flex justify-between items-end mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Most validated this week</h1>
                <Link to="/leaderboard" className="text-orange-600 font-medium hover:text-orange-700 text-sm">
                    Full leaderboard &rarr;
                </Link>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-orange-500 border-t-transparent" />
                </div>
            ) : topTen.length === 0 ? (
                <p className="text-center text-lg text-stone-500 bg-white py-10 rounded-2xl border border-stone-200 shadow-sm">
                    No trending ideas this week. Be the first to upvote!
                </p>
            ) : (
                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                    {topTen.map((item, idx) => (
                        <div 
                            key={item.idea_id || idx} 
                            className="flex items-center justify-between p-5 sm:px-6 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors"
                        >
                            <div className="flex items-center gap-5">
                                <span className={`w-8 text-center font-bold text-xl ${idx < 3 ? '' : 'text-stone-400'}`}>
                                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                                </span>
                                <div>
                                    <h3 className="font-semibold text-stone-900 text-lg leading-tight hover:text-orange-600 transition-colors">
                                        <Link to={`/ideas/${item.idea_id}`}>{item.title}</Link>
                                    </h3>
                                    <p className="text-sm text-stone-500 mt-1 font-medium">
                                        by {item.user_name || 'Anonymous'} &middot; {item.category || 'Tech'}
                                    </p>
                                </div>
                            </div>
                            <div className="font-bold text-emerald-600 text-lg ml-4">
                                {item.vote_count} <span className="hidden sm:inline">votes</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
