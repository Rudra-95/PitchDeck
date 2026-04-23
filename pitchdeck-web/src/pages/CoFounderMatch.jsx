import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Handshake, UserCircle, Briefcase } from 'lucide-react';
import api from '../api';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function CoFounderMatch() {
    const [roleFilter, setRoleFilter] = useState('');

    const { data: ideas, isLoading } = useQuery({
        queryKey: ['cofounders', roleFilter],
        queryFn: async () => (await api.get('/ideas')).data,
    });

    const matchingIdeas = ideas?.filter((i) => i.looking_for && (roleFilter === '' || i.looking_for === roleFilter)) || [];

    const tab = (active, label, onClick) => (
        <button
            type="button"
            onClick={onClick}
            className={`flex-1 rounded-xl px-4 py-3 font-medium transition-all duration-300 ${
                active
                    ? 'bg-pitch-accent text-white shadow-md shadow-orange-300/50'
                    : 'text-stone-600 hover:bg-orange-50/90 hover:text-pitch-accent'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="pt-6">
            <div className="mb-12 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="mb-6 inline-block rounded-full border border-orange-200/90 bg-orange-50/80 p-5 shadow-sm"
                >
                    <Handshake className="h-16 w-16 text-pitch-accent" />
                </motion.div>
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-stone-900 md:text-6xl">Find your co-founder</h1>
                <p className="text-lg text-stone-600">Join forces with validated startups looking for your skills.</p>
            </div>

            <div className="mb-12 flex justify-center">
                <GlassCard className="flex w-full max-w-xl flex-wrap gap-2 !p-2 sm:flex-nowrap">
                    {tab(roleFilter === '', 'All roles', () => setRoleFilter(''))}
                    {tab(roleFilter === 'Tech Co-founder', 'Tech', () => setRoleFilter('Tech Co-founder'))}
                    {tab(roleFilter === 'Business/Marketing', 'Business', () => setRoleFilter('Business/Marketing'))}
                    {tab(roleFilter === 'Design/Product', 'Design', () => setRoleFilter('Design/Product'))}
                </GlassCard>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-400 border-t-transparent" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {matchingIdeas.map((idea, i) => (
                        <GlassCard
                            hoverEffect={true}
                            animate={true}
                            delay={i * 0.05}
                            key={idea.id}
                            className="flex h-full flex-col !border-orange-200/80 !p-6"
                        >
                            <div className="mb-5">
                                <Badge variant="fuchsia" className="gap-1.5 px-3 py-1.5">
                                    <Briefcase className="h-4 w-4" /> Hiring: {idea.looking_for}
                                </Badge>
                            </div>

                            <h3 className="mb-3 line-clamp-1 text-2xl font-bold text-stone-900 transition-colors duration-300 hover:text-pitch-accent">
                                {idea.title}
                            </h3>
                            <p className="mb-8 flex-1 line-clamp-3 text-stone-600">{idea.description}</p>

                            <Link to={`/ideas/${idea.id}`} className="mt-auto block w-full">
                                <Button variant="primary" className="w-full gap-2">
                                    <UserCircle className="h-5 w-5" /> View project
                                </Button>
                            </Link>
                        </GlassCard>
                    ))}
                    {matchingIdeas.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-xl text-stone-600">No startups currently looking for this role.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
