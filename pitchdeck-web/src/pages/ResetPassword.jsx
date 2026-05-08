import { motion } from 'framer-motion';
import { Loader2, KeyRound, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing password reset token.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters.');
            return;
        }

        setStatus('loading');
        try {
            const { data } = await api.post('/auth/reset-password', { token, newPassword: password });
            setStatus('success');
            setMessage(data.message);
            setTimeout(() => {
                navigate('/auth');
            }, 3000);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.error || 'Failed to reset password.');
        }
    };

    return (
        <div className="relative flex min-h-[70vh] w-full items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/70 bg-slate-50/90 p-8 shadow-2xl shadow-slate-400/10 backdrop-blur-xl"
            >
                <div className="mb-8">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-pitch-accent">
                        <KeyRound className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-stone-900">Set new password</h2>
                    <p className="mt-2 text-stone-600">Your new password must be different from previously used passwords.</p>
                </div>

                {status === 'success' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-6 text-center">
                        <div className="mb-4 rounded-full bg-emerald-100 p-3">
                            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-stone-900">Password reset!</h3>
                        <p className="text-stone-500 mb-6">Your password has been successfully reset. Redirecting to login...</p>
                        <Link to="/auth" className="text-sm font-bold text-pitch-accent hover:underline">Click here to log in now</Link>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {status === 'error' && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 shadow-sm">
                                {message}
                            </div>
                        )}

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-stone-700">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={status === 'loading' || !token}
                                    className="w-full rounded-xl border border-orange-200/90 bg-white px-4 py-3 pr-11 text-stone-900 transition-colors focus:border-pitch-accent focus:outline-none focus:ring-2 focus:ring-orange-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 hover:bg-orange-50 hover:text-pitch-accent"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-semibold text-stone-700">Confirm Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={status === 'loading' || !token}
                                className="w-full rounded-xl border border-orange-200/90 bg-white px-4 py-3 text-stone-900 transition-colors focus:border-pitch-accent focus:outline-none focus:ring-2 focus:ring-orange-200"
                            />
                        </div>

                        <button
                            disabled={status === 'loading' || !token}
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
