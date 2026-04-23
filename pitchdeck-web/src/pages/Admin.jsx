import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Lightbulb, MessageSquare, Loader2, BarChart } from 'lucide-react';
import api from '../api';
import { GlassCard } from '../components/ui/GlassCard';

export default function Admin() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/admin/stats')
            .then(res => {
                setStats(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                setError(err.response?.data?.error || 'Failed to load admin stats. Are you logged in?');
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-orange-400" />
                <p className="mt-4 font-medium text-stone-600">Loading admin dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <GlassCard className="!border-rose-200 !bg-rose-50/80 p-8 text-center max-w-md shadow-lg shadow-rose-200/20">
                    <p className="font-semibold text-rose-800 text-lg uppercase tracking-wider mb-2">Access Denied</p>
                    <p className="text-rose-700">{error}</p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl pt-6 pb-12">
            <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight">Admin <span className="text-pitch-accent">Dashboard</span></h1>
            <p className="mt-2 text-stone-600">Manage all data across the platform.</p>

            {/* Stat Cards */}
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                <GlassCard className="flex items-center gap-6 !p-6 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-pitch-accent text-white shadow-md shadow-orange-300">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-stone-500">Total Users</p>
                        <p className="text-3xl font-bold text-stone-900">{stats?.totalUsers || 0}</p>
                    </div>
                </GlassCard>
                <GlassCard className="flex items-center gap-6 !p-6 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-300">
                        <Lightbulb className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-stone-500">Total Ideas</p>
                        <p className="text-3xl font-bold text-stone-900">{stats?.totalIdeas || 0}</p>
                    </div>
                </GlassCard>
                <GlassCard className="flex items-center gap-6 !p-6 shadow-sm transition-transform hover:-translate-y-1">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-300">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wider text-stone-500">Total Validations</p>
                        <p className="text-3xl font-bold text-stone-900">{stats?.totalFeedback || 0}</p>
                    </div>
                </GlassCard>
            </div>

            <div className="mt-8">
                <GlassCard className="!p-8 shadow-sm">
                    <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-stone-900">
                        <BarChart className="h-5 w-5 text-pitch-accent" /> Recent Platform Activity
                    </h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-stone-600">
                            <thead className="border-b border-orange-100 bg-orange-50/50 uppercase tracking-wider text-stone-700">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">User</th>
                                    <th className="px-4 py-3 font-semibold">Idea Submitted</th>
                                    <th className="px-4 py-3 font-semibold">Category</th>
                                    <th className="px-4 py-3 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentIdeas && stats.recentIdeas.length > 0 ? (
                                    stats.recentIdeas.map((idea, idx) => (
                                        <tr key={idea.id} className="border-b border-orange-100/50 hover:bg-orange-50/30 transition-colors">
                                            <td className="px-4 py-4 font-medium text-stone-800">{idea.user_name || 'Anonymous'}</td>
                                            <td className="px-4 py-4 text-stone-900 font-medium">{idea.title}</td>
                                            <td className="px-4 py-4">
                                                <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                                                    {idea.category || 'Other'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">{new Date(idea.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-6 text-center text-stone-500">
                                            No recent ideas found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
