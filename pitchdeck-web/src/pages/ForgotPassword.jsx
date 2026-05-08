import { motion } from 'framer-motion';
import { Loader2, Mail, ArrowLeft, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const [demoToken, setDemoToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setStatus('success');
            setMessage(data.message);
            if (data.demoToken) {
                setDemoToken(data.demoToken);
            }
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.error || 'Failed to request password reset.');
        }
    };

    return (
        <div className="relative flex min-h-[70vh] w-full items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-50/90 p-8 shadow-2xl shadow-slate-400/10 backdrop-blur-xl"
            >
                <Link to="/auth" className="mb-6 inline-flex items-center text-sm font-semibold text-stone-500 hover:text-pitch-accent transition-colors">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to login
                </Link>

                <div className="mb-8">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-pitch-accent">
                        <Mail className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-stone-900">Forgot password?</h2>
                    <p className="mt-2 text-stone-600">No worries, we'll send you reset instructions.</p>
                </div>

                {status === 'success' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                            <p className="font-semibold text-sm">✓ {message}</p>
                            <p className="mt-2 text-xs text-emerald-700/80">Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.</p>
                        </div>
                        
                        {demoToken && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800">!</span>
                                    <h4 className="font-bold text-amber-900 text-sm uppercase tracking-wide">Demo Mode Active</h4>
                                </div>
                                <p className="text-xs text-amber-800 mb-4">Because no email server is currently configured, use this magical bypass link to securely reset your password right now:</p>
                                <Link 
                                    to={`/reset-password?token=${demoToken}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3 text-sm font-bold text-white shadow hover:bg-amber-600 transition-colors"
                                >
                                    Open Reset Link <ExternalLink className="h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {status === 'error' && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 shadow-sm">
                                {message}
                            </div>
                        )}

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={status === 'loading'}
                                className="w-full rounded-xl border border-orange-200/90 bg-white px-4 py-3 text-stone-900 transition-colors focus:border-pitch-accent focus:outline-none focus:ring-2 focus:ring-orange-200"
                            />
                        </div>

                        <button
                            disabled={status === 'loading'}
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-stone-900 py-3.5 px-4 font-bold text-white shadow-lg transition-all hover:bg-stone-800 active:scale-[0.98] disabled:opacity-70"
                        >
                            {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Reset Password'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
}
