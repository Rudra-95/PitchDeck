import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, PlusCircle, Search, SlidersHorizontal } from 'lucide-react';
import api from '../api';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import IdeaCard from '../components/IdeaCard';
import IdeaGenerator from '../components/IdeaGenerator';

export default function Feed() {
    const [sort, setSort] = useState('recent');
    const [category, setCategory] = useState('');
    const [lookingFor, setLookingFor] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { data: ideas, isLoading, isError, error } = useQuery({
        queryKey: ['ideas', sort, category, lookingFor],
        queryFn: async () => {
            const res = await api.get('/ideas', { params: { sort, category, looking_for: lookingFor } });
            return res.data;
        },
    });

    const filteredIdeas =
        ideas?.filter((idea) => {
            const search = searchTerm.trim().toLowerCase();
            if (!search) return true;
            return (
                idea.title?.toLowerCase().includes(search) ||
                idea.description?.toLowerCase().includes(search) ||
                idea.category?.toLowerCase().includes(search) ||
                idea.looking_for?.toLowerCase().includes(search)
            );
        }) || [];

    const resetFilters = () => {
        setSort('recent');
        setCategory('');
        setLookingFor('');
        setSearchTerm('');
    };

    return (
        <div className="pt-6">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-stone-900">Explore ideas</h1>
                    <p className="mt-2 text-lg text-stone-600">Discover pitches and leave structured validation.</p>
                </div>
                <Link to="/submit">
                    <Button variant="primary" className="gap-2">
                        <PlusCircle className="h-4 w-4" /> Submit idea
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                <aside className="w-full shrink-0 lg:sticky lg:top-28 lg:w-72">
                    <GlassCard className="!p-5">
                        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-pitch-accent">
                            <SlidersHorizontal className="h-4 w-4" /> Filters
                        </div>

                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search title, text, tags…"
                                className="w-full rounded-xl border border-orange-200/90 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-pitch-accent focus:outline-none focus:ring-2 focus:ring-orange-200"
                            />
                        </div>

                        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-stone-500">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mb-4 w-full rounded-xl border border-orange-200/90 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-pitch-accent focus:outline-none"
                        >
                            <option value="">All categories</option>
                            <option value="Tech">Tech</option>
                            <option value="Fintech">Fintech</option>
                            <option value="Health">Health</option>
                            <option value="Consumer">Consumer</option>
                            <option value="Chemical">Chemical</option>
                            <option value="Energy">Energy</option>
                            <option value="Telecom">Telecom</option>
                            <option value="Automobile">Automobile</option>
                            <option value="Education">Education</option>
                            <option value="Other">Other</option>
                        </select>

                        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-stone-500">
                            Co-founder need
                        </label>
                        <select
                            value={lookingFor}
                            onChange={(e) => setLookingFor(e.target.value)}
                            className="mb-4 w-full rounded-xl border border-orange-200/90 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-pitch-accent focus:outline-none"
                        >
                            <option value="">Any</option>
                            <option value="Tech Co-founder">Tech co-founder</option>
                            <option value="Business/Marketing">Business / marketing</option>
                            <option value="Design/Product">Design / product</option>
                        </select>

                        <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-stone-500">Sort</label>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="mb-4 w-full rounded-xl border border-orange-200/90 bg-white px-3 py-2.5 text-sm text-stone-900 focus:border-pitch-accent focus:outline-none"
                        >
                            <option value="recent">Most recent</option>
                            <option value="trending">Trending (votes)</option>
                        </select>

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200/90 py-2.5 text-sm font-medium text-stone-700 transition duration-300 hover:border-orange-300 hover:bg-orange-50/80"
                        >
                            <Filter className="h-4 w-4" /> Reset filters
                        </button>
                    </GlassCard>
                    
                    <div className="mt-6 hidden lg:block">
                        <IdeaGenerator />
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    {isError ? (
                        <GlassCard className="!border-rose-200 !bg-rose-50/80 text-center !p-10">
                            <p className="text-rose-800">{error?.message || 'Could not load ideas.'}</p>
                            <p className="mt-2 text-sm text-stone-600">Is the API running on port 5000?</p>
                        </GlassCard>
                    ) : isLoading ? (
                        <div className="flex justify-center py-24">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-400 border-t-transparent" />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.45 }}
                            className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2"
                        >
                            {filteredIdeas.map((idea, i) => (
                                <IdeaCard key={idea.id} idea={idea} index={i} />
                            ))}
                            {filteredIdeas.length === 0 ? (
                                <GlassCard className="md:col-span-2 xl:col-span-2 text-center !border-dashed !border-orange-200 !p-12">
                                    <p className="text-stone-700">No ideas match these filters.</p>
                                    <p className="mt-2 text-sm text-stone-500">Try reset or a broader search.</p>
                                </GlassCard>
                            ) : null}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
