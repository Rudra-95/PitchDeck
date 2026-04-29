import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Rocket, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Auth() {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(!location.state?.register);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const { data } = await api.post(endpoint, formData);
            localStorage.setItem('pitchdeck_token', data.token);
            navigate('/feed');
        } catch (err) {
            setError(err.response?.data?.error || 'Authentication failed');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-[85vh] w-full items-center justify-center p-4">
            <div className="relative flex w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-50/90 shadow-2xl shadow-slate-400/10 backdrop-blur-xl">
                {/* Left Panel - Branding */}
                <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-pitch-accent to-orange-600 p-12 text-white md:flex relative overflow-hidden">
                    <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-orange-400/30 blur-[80px]" />
                    <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-amber-300/20 blur-[80px]" />
                    
                    <div className="relative z-10 flex items-center gap-2">
                        <Rocket className="h-8 w-8 text-white" />
                        <span className="text-2xl font-extrabold tracking-tight text-white">
                            PitchDeck
                        </span>
                    </div>

                    <div className="relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl font-bold leading-tight">
                                {isLogin ? 'Welcome back to your dashboard.' : 'Start testing your ideas today.'}
                            </h2>
                            <p className="mt-4 text-lg text-orange-100">
                                {isLogin 
                                    ? 'Log in to explore new startup pitches, check your validation scores, and match with co-founders.' 
                                    : 'Join thousands of founders and get structured community feedback before you build.'}
                            </p>
                        </motion.div>
                    </div>

                    <div className="relative z-10 text-sm font-medium text-orange-200">
                        <Sparkles className="inline relative -top-0.5 mr-2 h-4 w-4" /> Trusted by the top indie hackers.
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="w-full p-8 md:w-1/2 md:p-12 lg:p-16">
                    <motion.div
                        key={isLogin ? 'login' : 'register'}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="mb-2 text-3xl font-extrabold text-stone-900">
                            {isLogin ? 'Sign in' : 'Create an account'}
                        </h2>
                        <p className="mb-8 text-stone-500">
                            {isLogin ? 'Enter your details to access your account.' : 'Fill in the form to get started.'}
                        </p>

                        {error && (
                            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800 shadow-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-stone-700">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={isSubmitting}
                                        className="w-full rounded-xl border border-orange-200/90 bg-white px-4 py-3 text-stone-900 transition-colors focus:border-pitch-accent focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-stone-700">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={isSubmitting}
                                    className="w-full rounded-xl border border-orange-200/90 bg-white px-4 py-3 text-stone-900 transition-colors focus:border-pitch-accent focus:outline-none focus:ring-2 focus:ring-orange-200"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-semibold text-stone-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        disabled={isSubmitting}
                                        className="w-full rounded-xl border border-orange-200/90 bg-white px-4 py-3 pr-11 text-stone-900 transition-colors focus:border-pitch-accent focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 hover:bg-orange-50 hover:text-pitch-accent"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                disabled={isSubmitting}
                                type="submit"
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pitch-accent to-orange-600 py-3.5 px-4 font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                                    </>
                                ) : isLogin ? (
                                    'Sign in'
                                ) : (
                                    'Create account'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center text-sm text-stone-600">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-semibold text-pitch-accent underline-offset-4 hover:underline"
                            >
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
