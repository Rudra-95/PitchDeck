import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function SubmitIdea() {
    const [formData, setFormData] = useState({
        title: '',
        description: '', // We'll map problem/solution internally
        market: '',
        category: 'Tech',
        looking_for: 'Feedback only',
        stage: 'Just an idea'
    });
    
    // For UI separation of problem/solution based on mockup
    const [problem, setProblem] = useState('');
    const [solution, setSolution] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const combinedDescription = `**Problem:**\n${problem}\n\n**Solution:**\n${solution}\n\n**Target market:**\n${formData.market}\n\n**Stage:**\n${formData.stage}`;

        try {
            const res = await api.post('/ideas', {
                ...formData,
                description: combinedDescription
            });
            navigate(`/ideas/${res.data.id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to submit idea');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl pt-12 pb-24 px-4">
            <div className="bg-white rounded-[2rem] border border-stone-200 p-8 sm:p-12 shadow-sm">
                <h1 className="text-4xl font-extrabold text-stone-900 tracking-tight mb-2">Got an idea? Validate it.</h1>
                <p className="text-lg text-stone-600 mb-10 font-medium">
                    Share it with India's builder community. Get structured feedback — not just upvotes.
                </p>

                {error && (
                    <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 font-medium text-rose-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">Idea title</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. UPI-based micro-insurance for auto drivers"
                            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-colors"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">What problem does it solve?</label>
                        <textarea
                            required
                            rows={3}
                            placeholder="Describe the real pain point in 2–3 sentences..."
                            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-colors resize-none"
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">Your solution</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="How does your idea solve this problem?"
                            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-colors resize-none"
                            value={solution}
                            onChange={(e) => setSolution(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Target market</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. Gig workers in metro cities"
                                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 placeholder-stone-400 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-colors"
                                value={formData.market}
                                onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Category</label>
                            <select
                                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-colors"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Fintech</option>
                                <option>HealthTech</option>
                                <option>EdTech</option>
                                <option>AgriTech</option>
                                <option>SaaS</option>
                                <option>E-commerce</option>
                                <option>Other Tech</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Stage</label>
                            <select
                                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-colors"
                                value={formData.stage}
                                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                            >
                                <option>Just an idea</option>
                                <option>Working on MVP</option>
                                <option>MVP Built</option>
                                <option>Launched</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Looking for</label>
                            <select
                                className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 focus:border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-colors"
                                value={formData.looking_for}
                                onChange={(e) => setFormData({ ...formData, looking_for: e.target.value })}
                            >
                                <option>Feedback only</option>
                                <option>Tech Co-founder</option>
                                <option>Business Co-founder</option>
                                <option>Early Users</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#faf9f6] border border-stone-200 px-4 py-4 font-semibold text-stone-800 shadow-sm transition-all hover:bg-stone-100 hover:shadow disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit for community feedback \u2192'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
