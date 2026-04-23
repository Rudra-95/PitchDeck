import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ArrowDown,
    Zap,
    Target,
    Sparkles,
    LayoutDashboard,
    Shield,
    Globe2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
    }),
};

const features = [
    {
        icon: Zap,
        title: 'Fast validation',
        desc: 'Structured 4-axis scores plus comments so founders get signal in minutes, not weeks.',
        accent: 'from-amber-400 to-orange-500',
        glow: 'shadow-[0_12px_40px_-8px_rgba(251,146,60,0.35)]',
    },
    {
        icon: Shield,
        title: 'Honest feedback',
        desc: 'Problem clarity, market size, uniqueness, and solution quality — no vanity metrics.',
        accent: 'from-orange-400 to-pitch-accent',
        glow: 'shadow-[0_12px_40px_-8px_rgba(234,88,12,0.25)]',
    },
    {
        icon: Globe2,
        title: 'Co-founder ready',
        desc: 'Surface ideas that are actively hiring for tech, growth, or design — match talent to traction.',
        accent: 'from-teal-400 to-cyan-600',
        glow: 'shadow-[0_12px_40px_-8px_rgba(20,184,166,0.25)]',
    },
];

const stack = ['Vite + React', 'Tailwind v4', 'Express API', 'PostgreSQL', 'JWT Auth'];

const tags = ['#Startups', '#Validation', '#Feedback', '#CoFounders', '#ProductMarketFit'];

export default function Landing() {
    return (
        <div className="relative w-full pb-24">
            <section className="mx-auto max-w-4xl px-4 pt-6 text-center md:pt-14">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                    className="flex flex-col items-center"
                >
                    <motion.span
                        custom={0}
                        variants={fadeUp}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200/90 bg-white/80 px-4 py-1.5 text-sm font-medium text-pitch-accent shadow-sm backdrop-blur-md"
                    >
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        Validate ideas before you build
                    </motion.span>

                    <motion.h1
                        custom={1}
                        variants={fadeUp}
                        className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-stone-900 sm:text-5xl md:text-6xl lg:text-[3.35rem]"
                    >
                        Turn rough pitches into{' '}
                        <span className="bg-gradient-to-r from-pitch-accent via-orange-500 to-amber-600 bg-clip-text text-transparent">
                            investor-ready signal
                        </span>
                        .
                    </motion.h1>

                    <motion.p
                        custom={2}
                        variants={fadeUp}
                        className="mt-6 max-w-2xl text-lg text-stone-600 md:text-xl"
                    >
                        PitchDeck helps founders test concepts with structured community feedback, weekly trending
                        boards, and co-founder matching — all in one polished workspace.
                    </motion.p>

                    <motion.div
                        custom={3}
                        variants={fadeUp}
                        className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center"
                    >
                        <Link to="/feed" className="sm:min-w-[240px]">
                            <Button variant="primary" size="lg" className="w-full gap-2 rounded-full px-10 py-4 text-base">
                                <LayoutDashboard className="h-5 w-5" />
                                Open idea feed
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/submit" className="sm:min-w-[200px]">
                            <Button variant="outline" size="lg" className="w-full rounded-full px-8 py-4 text-base font-semibold">
                                Submit a pitch
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            <section className="mx-auto mt-24 max-w-6xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Why PitchDeck?</h2>
                    <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-pitch-accent via-orange-400 to-amber-400" />
                    <p className="mx-auto mt-4 max-w-xl text-stone-600">
                        Built for founders who want clarity — not noise — from people who understand product and
                        markets.
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-3">
                    {features.map((f, idx) => (
                        <motion.article
                            key={f.title}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ duration: 0.55, delay: idx * 0.1 }}
                            className={`group relative overflow-hidden rounded-2xl border border-orange-100/90 bg-white/80 p-8 text-center shadow-sm backdrop-blur-xl ${f.glow} transition-transform duration-500 hover:-translate-y-1`}
                        >
                            <div
                                className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${f.accent} text-white shadow-md`}
                            >
                                <f.icon className="h-8 w-8" strokeWidth={2} />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-stone-900">{f.title}</h3>
                            <p className="text-sm leading-relaxed text-stone-600 md:text-[15px]">{f.desc}</p>
                            <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-orange-200/0 transition-all duration-500 group-hover:opacity-100 group-hover:ring-orange-200/60" />
                        </motion.article>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-20 max-w-3xl px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="relative overflow-hidden rounded-3xl border border-orange-200/80 bg-white/90 p-8 text-center shadow-lg shadow-orange-200/25 backdrop-blur-xl md:p-12"
                >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-200/50 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-amber-100/80 blur-3xl" />

                    <Target className="mx-auto mb-4 h-10 w-10 text-pitch-accent" />
                    <h2 className="text-2xl font-extrabold text-stone-900 md:text-3xl">Ship your next idea with confidence.</h2>
                    <p className="mx-auto mt-3 max-w-lg text-stone-600">
                        Browse the feed, leave structured validation, and climb the weekly leaderboard — no slide deck
                        required to start.
                    </p>
                    <Link to="/feed" className="mt-8 inline-block">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pitch-accent to-orange-600 px-8 py-4 text-base font-bold text-white shadow-[0_8px_28px_-4px_rgba(234,88,12,0.55)] transition duration-300 hover:brightness-105 active:scale-[0.98]"
                        >
                            <ArrowDown className="h-5 w-5" />
                            Explore the feed — free
                        </button>
                    </Link>
                </motion.div>
            </section>

            <section className="mx-auto mt-16 max-w-4xl px-4 text-center">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Architecture you can trust
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {stack.map((label) => (
                        <span
                            key={label}
                            className="rounded-full border border-orange-200/70 bg-white/90 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm backdrop-blur-md"
                        >
                            {label}
                        </span>
                    ))}
                </div>
            </section>

            <footer className="mx-auto mt-20 max-w-4xl border-t border-orange-200/60 px-4 pt-10 text-center">
                <p className="text-sm text-stone-500">© {new Date().getFullYear()} PitchDeck. All rights reserved.</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    {tags.map((t) => (
                        <span key={t} className="text-xs font-medium text-stone-500">
                            {t}
                        </span>
                    ))}
                </div>
            </footer>
        </div>
    );
}
