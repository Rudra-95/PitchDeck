import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';

function shuffleArray(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

export default function IdeaBattle() {
  const [pair, setPair] = useState(null);
  const [result, setResult] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: ideas = [], isLoading } = useQuery({
    queryKey: ['battleIdeas'],
    queryFn: async () => {
      const res = await api.get('/ideas', { params: { sort: 'trending' } });
      return res.data;
    },
  });

  const candidatePair = useMemo(() => {
    if (ideas.length < 2) return null;
    const shuffled = shuffleArray(ideas);
    return [shuffled[0], shuffled[1]];
  }, [ideas]);

  const loadPair = () => {
    if (candidatePair) {
      setPair(candidatePair);
      setResult(null);
      setSelected(null);
      setError('');
    }
  };

  const handleVote = async (choice) => {
    if (!pair) return;
    setSelected(choice);
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/ai/compare', {
        ideaA: pair[0],
        ideaB: pair[1],
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Comparison failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl pt-10 pb-20 px-4">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-pitch-accent/10 text-pitch-accent shadow-sm">
          <Sparkles className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 md:text-5xl">Idea Battle Mode</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
          Two startup ideas go head-to-head. Vote for the one you would fund, then get AI comparison analysis to learn why.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <GlassCard className="!p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-stone-400">Battle deck</p>
                <h2 className="text-2xl font-bold text-stone-900">Current match-up</h2>
              </div>
              <Button variant="secondary" onClick={loadPair} className="gap-2">
                <ArrowRight className="h-4 w-4" /> Refresh pair
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-14">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-400 border-t-transparent" />
              </div>
            ) : !candidatePair ? (
              <p className="text-stone-600">Need at least two ideas in the feed to start a battle.</p>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {pair ? pair.map((idea, index) => (
                  <GlassCard key={idea.id} className={`!p-6 border ${selected === index ? 'border-pitch-accent shadow-lg shadow-pitch-accent/10' : 'border-stone-200'} hover:border-pitch-accent`}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs uppercase tracking-[0.25em] text-stone-400">Idea {index === 0 ? 'A' : 'B'}</span>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">{idea.category || 'Tech'}</span>
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 mb-3">{idea.title}</h3>
                    <p className="text-sm leading-6 text-stone-600 mb-5 line-clamp-5">{idea.description}</p>
                    <div className="flex flex-col gap-3">
                      <Button variant={selected === index ? 'primary' : 'outline'} onClick={() => handleVote(index)} disabled={loading} className="w-full">
                        {selected === index ? 'Selected' : 'Fund this idea'}
                      </Button>
                      <Link to={`/ideas/${idea.id}`} className="text-sm font-medium text-pitch-accent hover:underline">
                        Open idea details →
                      </Link>
                    </div>
                  </GlassCard>
                )) : (
                  <p className="text-stone-600">Click refresh to load a battle pair.</p>
                )}
              </div>
            )}
          </GlassCard>

          {error ? (
            <GlassCard className="!p-6 !border-rose-200 !bg-rose-50/80 text-rose-800">
              {error}
            </GlassCard>
          ) : null}

          {result ? (
            <GlassCard className="!p-6">
              <div className="mb-4 flex items-center gap-3 text-pitch-accent">
                <Trophy className="h-5 w-5" />
                <h2 className="text-xl font-bold">AI comparison analysis</h2>
              </div>
              <div className="space-y-4 text-sm leading-7 text-stone-700">
                <p><strong>Winner:</strong> {result.winner === 'draw' ? 'Too close to call' : result.winner === 'ideaA' ? 'Idea A' : 'Idea B'}</p>
                <p><strong>Market edge:</strong> {result.market_edge}</p>
                <p><strong>Recommendation:</strong> {result.recommendation}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Score A</p>
                    <p className="mt-2 text-3xl font-extrabold text-stone-900">{result.scoreA}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Score B</p>
                    <p className="mt-2 text-3xl font-extrabold text-stone-900">{result.scoreB}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          ) : null}
        </div>

        <div className="space-y-6">
          <GlassCard className="!p-6 bg-orange-50/80">
            <div className="mb-4 flex items-center gap-3 text-orange-900">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="text-lg font-bold">Why battle mode works</h2>
            </div>
            <p className="text-sm leading-7 text-orange-900/90">
              Side-by-side comparisons force fast judgment, build virality, and create public ranking credibility. The AI layer turns votes into insights investors can trust.
            </p>
          </GlassCard>

          <GlassCard className="!p-6">
            <h2 className="mb-4 text-lg font-bold text-stone-900">Quick growth hack</h2>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>Embed battle results in social sharing cards.</li>
              <li>Use AI analysis to reward winners with a "Battle star" badge.</li>
              <li>Run weekly contests for the highest-rated pitches.</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
