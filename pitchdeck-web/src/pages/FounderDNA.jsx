import { ArrowRight, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useState } from 'react';
import api from '../api';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';

export default function FounderDNA() {
  const [form, setForm] = useState({
    submissions: '',
    feedbackResponses: '',
    writingSample: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!form.submissions.trim() && !form.writingSample.trim()) {
      setError('Please share either your idea submissions or a writing sample.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/ai/founder-dna', form);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Founder analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl pt-10 pb-20 px-4">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-pitch-accent/10 text-pitch-accent shadow-sm">
          <Sparkles className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 md:text-5xl">Founder DNA Analyzer</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
          Discover whether you are a Visionary, Executor, Analyst or Hustler — and get your ideal co-founder, weak areas, and India advantage.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <GlassCard className="!p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">Your idea submissions</label>
              <textarea
                rows={5}
                value={form.submissions}
                onChange={(e) => setForm({ ...form, submissions: e.target.value })}
                placeholder="Paste your recent pitch text, idea listing, or founder bio..."
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-stone-900 focus:border-pitch-accent focus:outline-none focus:ring-1 focus:ring-pitch-accent/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">Feedback and reviews</label>
              <textarea
                rows={4}
                value={form.feedbackResponses}
                onChange={(e) => setForm({ ...form, feedbackResponses: e.target.value })}
                placeholder="Optional: anything mentors or users have said about your idea."
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-stone-900 focus:border-pitch-accent focus:outline-none focus:ring-1 focus:ring-pitch-accent/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">Founder writing sample</label>
              <textarea
                rows={5}
                value={form.writingSample}
                onChange={(e) => setForm({ ...form, writingSample: e.target.value })}
                placeholder="Tell us what drives you, your strengths, or your founder story."
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-stone-900 focus:border-pitch-accent focus:outline-none focus:ring-1 focus:ring-pitch-accent/20"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
            ) : null}

            <Button type="submit" variant="primary" className="w-full justify-center" disabled={loading}>
              {loading ? 'Analyzing founder DNA...' : 'Analyze founder DNA'}
            </Button>
          </form>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="!p-6 bg-orange-50/80">
            <div className="mb-4 flex items-center gap-3 text-orange-900">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="text-lg font-bold">Why this matters</h2>
            </div>
            <p className="text-sm leading-7 text-orange-900/90">
              Investors bet on founders. This feature helps you position your personal style, discover the right co-founder fit, and highlight India-specific strengths.
            </p>
          </GlassCard>

          <GlassCard className="!p-6 bg-white/95">
            <div className="mb-4 flex items-center gap-3 text-pitch-accent">
              <Users className="h-5 w-5" />
              <h2 className="text-lg font-bold">What you get</h2>
            </div>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>Founder archetype and core strengths</li>
              <li>Best co-founder match for your style</li>
              <li>India-specific execution edge</li>
              <li>Clear weak areas to fix first</li>
            </ul>
          </GlassCard>
        </div>
      </div>

      {result ? (
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <GlassCard className="!p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <Badge variant="indigo">Founder Type</Badge>
              <span className="text-xs uppercase tracking-[0.25em] text-stone-400">Your profile</span>
            </div>
            <h3 className="text-3xl font-extrabold text-stone-900">{result.founder_type}</h3>
            <p className="mt-4 text-sm leading-6 text-stone-600">{result.strength_summary}</p>
          </GlassCard>

          <GlassCard className="!p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <Badge variant="fuchsia">Best Match</Badge>
              <span className="text-xs uppercase tracking-[0.25em] text-stone-400">Co-founder</span>
            </div>
            <h3 className="text-3xl font-extrabold text-stone-900">{result.ideal_cofounder_type}</h3>
            <p className="mt-4 text-sm leading-6 text-stone-600">This is the co-founder profile that complements your natural style.</p>
          </GlassCard>

          <GlassCard className="!p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <Badge variant="emerald">Compatibility</Badge>
              <span className="text-xs uppercase tracking-[0.25em] text-stone-400">Score</span>
            </div>
            <div className="text-5xl font-extrabold text-stone-900">{result.compatibility_score}%</div>
            <p className="mt-4 text-sm leading-6 text-stone-600">Confidence based on your tonal style, momentum, and team fit.</p>
          </GlassCard>

          <GlassCard className="lg:col-span-2 !p-6">
            <div className="mb-4 flex items-center gap-3 text-stone-900">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-lg font-bold">Weakness areas</h3>
            </div>
            <ul className="space-y-3 text-sm text-stone-600">
              {result.weak_areas.map((area, index) => (
                <li key={index} className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
                  {area}
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="!p-6">
            <div className="mb-4 flex items-center gap-3 text-pitch-accent">
              <ArrowRight className="h-5 w-5" />
              <h3 className="text-lg font-bold">India edge</h3>
            </div>
            <p className="text-sm leading-7 text-stone-600">{result.india_edge}</p>
          </GlassCard>
        </div>
      ) : null}
    </div>
  );
}
