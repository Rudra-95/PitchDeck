import { BarChart, ChevronLeft, ChevronRight, Eye, Lightbulb, Loader2, MessageSquare, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api';
import { GlassCard } from '../components/ui/GlassCard';

export default function Admin() {
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Ideas tab state
    const [ideas, setIdeas] = useState([]);
    const [ideasPage, setIdeasPage] = useState(1);
    const [ideasTotal, setIdeasTotal] = useState(0);
    const [ideasSearch, setIdeasSearch] = useState('');
    const [ideasCategory, setIdeasCategory] = useState('');
    const [ideaSortBy, setIdeaSortBy] = useState('recent');

    // Users tab state
    const [users, setUsers] = useState([]);
    const [usersPage, setUsersPage] = useState(1);
    const [usersTotal, setUsersTotal] = useState(0);
    const [usersSearch, setUsersSearch] = useState('');
    const [usersSortBy, setUsersSortBy] = useState('recent');

    // Feedback tab state
    const [feedback, setFeedback] = useState([]);
    const [feedbackPage, setFeedbackPage] = useState(1);
    const [feedbackTotal, setFeedbackTotal] = useState(0);
    const [feedbackIdeaId, setFeedbackIdeaId] = useState('');

    // Modal state
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [ideaDetails, setIdeaDetails] = useState(null);

    const LIMIT = 15;
    const CATEGORIES = ['Fintech', 'EdTech', 'HealthTech', 'AgriTech', 'SaaS', 'E-commerce', 'CleanTech', 'Other'];

    // Load stats on mount
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

    // Load ideas when tab changes or filters change
    useEffect(() => {
        if (activeTab === 'ideas') {
            setIsLoading(true);
            api.get('/admin/ideas', {
                params: {
                    page: ideasPage,
                    limit: LIMIT,
                    search: ideasSearch,
                    category: ideasCategory,
                    sortBy: ideaSortBy
                }
            })
                .then(res => {
                    setIdeas(res.data.ideas);
                    setIdeasTotal(res.data.total);
                    setIsLoading(false);
                })
                .catch(err => {
                    setError('Failed to load ideas');
                    setIsLoading(false);
                });
        }
    }, [activeTab, ideasPage, ideasSearch, ideasCategory, ideaSortBy]);

    // Load users when tab changes or filters change
    useEffect(() => {
        if (activeTab === 'users') {
            setIsLoading(true);
            api.get('/admin/users', {
                params: {
                    page: usersPage,
                    limit: LIMIT,
                    search: usersSearch,
                    sortBy: usersSortBy
                }
            })
                .then(res => {
                    setUsers(res.data.users);
                    setUsersTotal(res.data.total);
                    setIsLoading(false);
                })
                .catch(err => {
                    setError('Failed to load users');
                    setIsLoading(false);
                });
        }
    }, [activeTab, usersPage, usersSearch, usersSortBy]);

    // Load feedback when tab changes
    useEffect(() => {
        if (activeTab === 'feedback') {
            setIsLoading(true);
            api.get('/admin/feedback', {
                params: {
                    page: feedbackPage,
                    limit: LIMIT,
                    ideaId: feedbackIdeaId || undefined
                }
            })
                .then(res => {
                    setFeedback(res.data.feedback);
                    setFeedbackTotal(res.data.total);
                    setIsLoading(false);
                })
                .catch(err => {
                    setError('Failed to load feedback');
                    setIsLoading(false);
                });
        }
    }, [activeTab, feedbackPage, feedbackIdeaId]);

    const loadIdeaDetails = async (ideaId) => {
        try {
            const res = await api.get(`/admin/ideas/${ideaId}`);
            setSelectedIdea(ideaId);
            setIdeaDetails(res.data);
        } catch (err) {
            setError('Failed to load idea details');
        }
    };

    if (isLoading && !stats) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-orange-400" />
                <p className="mt-4 font-medium text-stone-600">Loading admin dashboard...</p>
            </div>
        );
    }

    if (error && !stats) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center">
                <GlassCard className="!border-rose-200 !bg-rose-50/80 p-8 text-center max-w-md shadow-lg shadow-rose-200/20">
                    <p className="font-semibold text-rose-800 text-lg uppercase tracking-wider mb-2">Access Denied</p>
                    <p className="text-rose-700">{error}</p>
                </GlassCard>
            </div>
        );
    }

    const TabButton = ({ tab, label, icon: Icon }) => (
        <button
            onClick={() => {
                setActiveTab(tab);
                setError(null);
            }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab
                    ? 'bg-pitch-accent text-white shadow-lg shadow-orange-300/30'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
        >
            <Icon className="h-4 w-4" /> {label}
        </button>
    );

    return (
        <div className="mx-auto max-w-7xl pt-6 pb-12 px-4">
            <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight">
                Admin <span className="text-pitch-accent">Control Panel</span>
            </h1>
            <p className="mt-2 text-stone-600">Monitor, filter, and manage all platform data.</p>

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

            {/* Tab Navigation */}
            <div className="mt-10 flex gap-4 flex-wrap">
                <TabButton tab="overview" label="Overview" icon={BarChart} />
                <TabButton tab="ideas" label="All Ideas" icon={Lightbulb} />
                <TabButton tab="users" label="All Users" icon={Users} />
                <TabButton tab="feedback" label="Feedback Log" icon={MessageSquare} />
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
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
                                        stats.recentIdeas.map((idea) => (
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
            )}

            {/* Ideas Tab */}
            {activeTab === 'ideas' && (
                <div className="mt-8 space-y-6">
                    <GlassCard className="!p-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <label className="text-sm font-semibold text-stone-700">Search</label>
                                <input
                                    type="text"
                                    placeholder="Search ideas..."
                                    value={ideasSearch}
                                    onChange={(e) => {
                                        setIdeasSearch(e.target.value);
                                        setIdeasPage(1);
                                    }}
                                    className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-2 focus:border-pitch-accent focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-stone-700">Category</label>
                                <select
                                    value={ideasCategory}
                                    onChange={(e) => {
                                        setIdeasCategory(e.target.value);
                                        setIdeasPage(1);
                                    }}
                                    className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-2 focus:border-pitch-accent focus:outline-none"
                                >
                                    <option value="">All Categories</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-stone-700">Sort by</label>
                                <select
                                    value={ideaSortBy}
                                    onChange={(e) => {
                                        setIdeaSortBy(e.target.value);
                                        setIdeasPage(1);
                                    }}
                                    className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-2 focus:border-pitch-accent focus:outline-none"
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="votes">Most Voted</option>
                                </select>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="!p-6">
                        {isLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-stone-600">
                                        <thead className="border-b border-orange-100 bg-orange-50/50 uppercase tracking-wider text-stone-700">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold">Title</th>
                                                <th className="px-4 py-3 font-semibold">User</th>
                                                <th className="px-4 py-3 font-semibold">Category</th>
                                                <th className="px-4 py-3 font-semibold">Votes</th>
                                                <th className="px-4 py-3 font-semibold">Date</th>
                                                <th className="px-4 py-3 font-semibold">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ideas.map(idea => (
                                                <tr key={idea.id} className="border-b border-orange-100/50 hover:bg-orange-50/30 transition-colors">
                                                    <td className="px-4 py-4 font-medium text-stone-800 max-w-xs truncate">{idea.title}</td>
                                                    <td className="px-4 py-4">{idea.user_name}</td>
                                                    <td className="px-4 py-4">
                                                        <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                                                            {idea.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 font-semibold text-stone-900">{idea.votes || 0}</td>
                                                    <td className="px-4 py-4">{new Date(idea.created_at).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4">
                                                        <button
                                                            onClick={() => loadIdeaDetails(idea.id)}
                                                            className="text-pitch-accent hover:underline font-medium"
                                                        >
                                                            <Eye className="h-4 w-4 inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="mt-6 flex items-center justify-between">
                                    <p className="text-sm text-stone-600">
                                        Showing {ideas.length} of {ideasTotal} ideas (Page {ideasPage})
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setIdeasPage(p => Math.max(1, p - 1))}
                                            disabled={ideasPage === 1}
                                            className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-2 disabled:opacity-50"
                                        >
                                            <ChevronLeft className="h-4 w-4" /> Prev
                                        </button>
                                        <button
                                            onClick={() => setIdeasPage(p => p + 1)}
                                            disabled={ideas.length < LIMIT}
                                            className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-2 disabled:opacity-50"
                                        >
                                            Next <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </GlassCard>
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="mt-8 space-y-6">
                    <GlassCard className="!p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-semibold text-stone-700">Search (Name or Email)</label>
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={usersSearch}
                                    onChange={(e) => {
                                        setUsersSearch(e.target.value);
                                        setUsersPage(1);
                                    }}
                                    className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-2 focus:border-pitch-accent focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-stone-700">Sort by</label>
                                <select
                                    value={usersSortBy}
                                    onChange={(e) => {
                                        setUsersSortBy(e.target.value);
                                        setUsersPage(1);
                                    }}
                                    className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-2 focus:border-pitch-accent focus:outline-none"
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="ideas">Most Active (by ideas)</option>
                                </select>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="!p-6">
                        {isLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-stone-600">
                                        <thead className="border-b border-orange-100 bg-orange-50/50 uppercase tracking-wider text-stone-700">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold">Name</th>
                                                <th className="px-4 py-3 font-semibold">Email</th>
                                                <th className="px-4 py-3 font-semibold">Ideas Posted</th>
                                                <th className="px-4 py-3 font-semibold">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.map(user => (
                                                <tr key={user.id} className="border-b border-orange-100/50 hover:bg-orange-50/30 transition-colors">
                                                    <td className="px-4 py-4 font-medium text-stone-800">{user.name}</td>
                                                    <td className="px-4 py-4">{user.email}</td>
                                                    <td className="px-4 py-4 font-semibold text-stone-900">{user.idea_count || 0}</td>
                                                    <td className="px-4 py-4">{new Date(user.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="mt-6 flex items-center justify-between">
                                    <p className="text-sm text-stone-600">
                                        Showing {users.length} of {usersTotal} users (Page {usersPage})
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                                            disabled={usersPage === 1}
                                            className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-2 disabled:opacity-50"
                                        >
                                            <ChevronLeft className="h-4 w-4" /> Prev
                                        </button>
                                        <button
                                            onClick={() => setUsersPage(p => p + 1)}
                                            disabled={users.length < LIMIT}
                                            className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-2 disabled:opacity-50"
                                        >
                                            Next <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </GlassCard>
                </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
                <div className="mt-8 space-y-6">
                    <GlassCard className="!p-6">
                        <label className="text-sm font-semibold text-stone-700">Filter by Idea ID (optional)</label>
                        <input
                            type="number"
                            placeholder="Leave blank to see all feedback"
                            value={feedbackIdeaId}
                            onChange={(e) => {
                                setFeedbackIdeaId(e.target.value);
                                setFeedbackPage(1);
                            }}
                            className="mt-2 w-full rounded-lg border border-stone-200 px-4 py-2 focus:border-pitch-accent focus:outline-none"
                        />
                    </GlassCard>

                    <GlassCard className="!p-6">
                        {isLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    {feedback.map(fb => (
                                        <div key={fb.id} className="rounded-lg border border-stone-200 p-4 hover:border-pitch-accent transition-colors">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-stone-900">Idea: {fb.idea_title}</p>
                                                    <p className="text-sm text-stone-600">By: {fb.user_name}</p>
                                                    <p className="mt-2 text-sm text-stone-700">{JSON.stringify(fb.structured_data).slice(0, 200)}...</p>
                                                </div>
                                                <p className="text-xs text-stone-500 whitespace-nowrap">{new Date(fb.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="mt-6 flex items-center justify-between">
                                    <p className="text-sm text-stone-600">
                                        Showing {feedback.length} of {feedbackTotal} feedback entries (Page {feedbackPage})
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setFeedbackPage(p => Math.max(1, p - 1))}
                                            disabled={feedbackPage === 1}
                                            className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-2 disabled:opacity-50"
                                        >
                                            <ChevronLeft className="h-4 w-4" /> Prev
                                        </button>
                                        <button
                                            onClick={() => setFeedbackPage(p => p + 1)}
                                            disabled={feedback.length < LIMIT}
                                            className="flex items-center gap-1 rounded-lg border border-stone-200 px-3 py-2 disabled:opacity-50"
                                        >
                                            Next <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </GlassCard>
                </div>
            )}

            {/* Idea Details Modal */}
            {selectedIdea && ideaDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <GlassCard className="max-h-[90vh] w-full max-w-2xl overflow-y-auto !p-8">
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <h2 className="text-2xl font-bold text-stone-900">{ideaDetails.idea.title}</h2>
                            <button
                                onClick={() => {
                                    setSelectedIdea(null);
                                    setIdeaDetails(null);
                                }}
                                className="text-stone-500 hover:text-stone-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="text-sm font-semibold text-stone-600 uppercase">Posted by</p>
                                <p className="text-lg font-medium text-stone-900">{ideaDetails.user?.name} ({ideaDetails.user?.email})</p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-semibold text-stone-600 uppercase">Category</p>
                                    <span className="inline-block mt-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                                        {ideaDetails.idea.category}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-stone-600 uppercase">Votes</p>
                                    <p className="mt-2 text-2xl font-bold text-stone-900">{ideaDetails.vote_count}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-stone-600 uppercase">Description</p>
                                <p className="mt-2 text-stone-700 leading-7">{ideaDetails.idea.description}</p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-stone-600 uppercase mb-3">Feedback Received ({ideaDetails.feedback?.length || 0})</p>
                                {ideaDetails.feedback?.length > 0 ? (
                                    <div className="space-y-3">
                                        {ideaDetails.feedback.map((fb, idx) => (
                                            <div key={idx} className="rounded-lg bg-stone-50 p-4">
                                                <p className="text-sm text-stone-600">{JSON.stringify(fb.structured_data, null, 2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-stone-500">No feedback yet.</p>
                                )}
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </div>
    );
}
