import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MessageSquare, Rocket, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';

export default function Profile() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('pitchdeck_token') : null;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['profile', 'me'],
        queryFn: async () => (await api.get('/profile/me')).data,
        enabled: !!token,
    });

    if (!token) {
        return (
            <div className="mx-auto max-w-lg pt-16 text-center">
                <GlassCard className="!p-10">
                    <Rocket className="mx-auto mb-4 h-12 w-12 text-pitch-accent" />
                    <h1 className="text-2xl font-bold text-stone-900">Sign in to view your profile</h1>
                    <p className="mt-2 text-stone-600">Your ideas and feedback you received will show here.</p>
                    <p className="mt-4 text-sm text-stone-500">Use Login / Sign up in the navigation bar.</p>
                </GlassCard>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center py-24">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-400 border-t-transparent" />
            </div>
        );
    }

    if (isError) {
        return (
            <GlassCard className="mx-auto max-w-lg !border-rose-200 !bg-rose-50/80 !p-8 text-center">
                <p className="text-rose-800">{error?.message || 'Failed to load profile.'}</p>
            </GlassCard>
        );
    }

    const ideas = data?.ideas || [];
    const feedbackReceived = data?.feedbackReceived || [];

    const parsedFeedback = feedbackReceived.map((fb) => {
        let sd = fb.structured_data;
        if (typeof sd === 'string') {
            try {
                sd = JSON.parse(sd);
            } catch {
                sd = {};
            }
        }
        return sd || {};
    });

    const averageScore = parsedFeedback.length
        ? Math.round(
              parsedFeedback.reduce((sum, item) => {
                  const values = [item.problem_clarity, item.market_size, item.uniqueness, item.solution_quality].filter(Boolean);
                  return sum + (values.reduce((a, b) => a + b, 0) / Math.max(values.length, 1));
              }, 0) / parsedFeedback.length
          )
        : 0;

    const growthHeadline = averageScore
        ? `Your feedback is averaging ${averageScore}/10 across core validation metrics.`
        : 'Collect feedback to build your founder growth story.';

    const userName = data?.user?.name ? data.user.name.split(' ')[0] : 'Your';

    return (
        <div className="mx-auto max-w-5xl pt-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-stone-900">{userName}&apos;s dashboard</h1>
                <p className="mt-2 text-stone-600">Ideas you posted and validation from the community.</p>
            </motion.div>

            <section className="mb-10 grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
                <GlassCard className="!p-8">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-stone-900">Founder Growth Dashboard</h2>
                            <p className="mt-1 text-sm text-stone-600">Track idea traction, feedback quality, and your strength score over time.</p>
                        </div>
                        <Badge variant="emerald">{ideas.length} ideas</Badge>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl border border-stone-200 bg-white/80 p-5">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">Average feedback</p>
                            <p className="mt-3 text-4xl font-extrabold text-stone-900">{averageScore || '--'}/10</p>
                            <p className="mt-3 text-sm text-stone-600">{growthHeadline}</p>
                        </div>
                        <div className="rounded-3xl border border-stone-200 bg-white/80 p-5">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">Validation entries</p>
                            <p className="mt-3 text-4xl font-extrabold text-stone-900">{feedbackReceived.length}</p>
                            <p className="mt-3 text-sm text-stone-600">Feedback points received across your ideas.</p>
                        </div>
                    </div>
                </GlassCard>
                <GlassCard className="!p-8 bg-orange-50/80">
                    <div className="mb-4 flex items-center gap-3 text-orange-900">
                        <Sparkles className="h-5 w-5" />
                        <h2 className="text-lg font-bold">Founder DNA</h2>
                    </div>
                    <p className="text-sm text-orange-900/90 leading-7">
                        Want an instant founder archetype and co-founder match? Use the Founder DNA Analyzer to locate your strengths and weaknesses.
                    </p>
                    <Link to="/founder-dna">
                        <Button variant="secondary" className="mt-6 w-full justify-center">
                            Explore Founder DNA
                        </Button>
                    </Link>
                </GlassCard>
            </section>

            <section className="mb-14">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-stone-900">
                    <Sparkles className="h-5 w-5 text-pitch-accent" /> Your ideas
                </h2>
                {ideas.length === 0 ? (
                    <GlassCard className="!border-dashed !border-orange-200 !p-8 text-center text-stone-600">
                        You have not submitted any ideas yet.{' '}
                        <Link to="/submit" className="font-medium text-pitch-accent hover:underline">
                            Pitch one now
                        </Link>
                        .
                    </GlassCard>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {ideas.map((idea, i) => (
                            <GlassCard key={idea.id} hoverEffect animate delay={i * 0.06} className="!p-5">
                                <div className="mb-2 flex items-center justify-between">
                                    <Badge variant="indigo">{idea.category}</Badge>
                                    <span className="font-mono text-sm text-rose-700">♥ {idea.vote_count ?? 0}</span>
                                </div>
                                <h3 className="text-lg font-bold text-stone-900">{idea.title}</h3>
                                <p className="mt-1 line-clamp-2 text-sm text-stone-600">{idea.description}</p>
                                <Link to={`/ideas/${idea.id}`} className="mt-4 inline-block">
                                    <Button variant="secondary" size="sm">
                                        Open idea
                                    </Button>
                                </Link>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </section>

            <section>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-stone-900">
                    <MessageSquare className="h-5 w-5 text-pitch-accent" /> Feedback on your ideas
                </h2>
                {feedbackReceived.length === 0 ? (
                    <GlassCard className="!border-dashed !border-orange-200 !p-8 text-center text-stone-600">
                        No structured feedback on your ideas yet. Share your pitch in the feed to gather reviews.
                    </GlassCard>
                ) : (
                    <div className="space-y-4">
                        {feedbackReceived.map((fb, i) => {
                            let sd = fb.structured_data;
                            if (typeof sd === 'string') {
                                try {
                                    sd = JSON.parse(sd);
                                } catch {
                                    sd = {};
                                }
                            }
                            return (
                                <GlassCard key={fb.id} hoverEffect animate delay={i * 0.05} className="!p-6">
                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-orange-100 pb-3">
                                        <span className="font-semibold text-stone-900">{fb.idea_title}</span>
                                        <Badge variant="default" className="text-xs">
                                            from {fb.reviewer_name || fb.user_name || 'User'}
                                        </Badge>
                                    </div>
                                    <div className="mb-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                                        <span className="text-stone-600">
                                            Clarity <Badge variant="indigo" className="ml-1">{sd?.problem_clarity}/10</Badge>
                                        </span>
                                        <span className="text-stone-600">
                                            Market <Badge variant="fuchsia" className="ml-1">{sd?.market_size}/10</Badge>
                                        </span>
                                        <span className="text-stone-600">
                                            Unique <Badge variant="emerald" className="ml-1">{sd?.uniqueness}/10</Badge>
                                        </span>
                                        <span className="text-stone-600">
                                            Solution <Badge variant="amber" className="ml-1">{sd?.solution_quality}/10</Badge>
                                        </span>
                                    </div>
                                    <p className="italic text-stone-700">&ldquo;{sd?.comments}&rdquo;</p>
                                    <Link
                                        to={`/ideas/${fb.idea_id}`}
                                        className="mt-3 inline-block text-sm font-medium text-pitch-accent hover:underline"
                                    >
                                        View idea →
                                    </Link>
                                </GlassCard>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
