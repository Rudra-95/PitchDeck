import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle2, Lock, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';

export default function CheckoutSimulation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { title, price, ideaId, type, description } = location.state || { 
        title: 'Premium Upgrade', 
        price: '10.00', 
        ideaId: null, 
        type: 'promote',
        description: 'Upgrade your PitchDeck experience.'
    };
    
    const [status, setStatus] = useState('idle'); // idle, processing, success

    const handlePay = () => {
        setStatus('processing');
        setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
                if (ideaId) {
                    navigate(`/ideas/${ideaId}`, { state: { paymentSuccess: true, message: `Successfully activated ${title}!` } });
                } else {
                    navigate('/feed');
                }
            }, 2000);
        }, 2000);
    };

    if (status === 'success') {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 shadow-xl shadow-emerald-500/20">
                        <CheckCircle2 className="h-12 w-12 text-emerald-600" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-stone-900 mb-2">Payment Successful!</h2>
                    <p className="text-lg text-stone-600">Redirecting you back securely...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <GlassCard className="w-full max-w-4xl !p-0 !overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-orange-900/10 border-orange-200">
                {/* Visual Left Side */}
                <div className="bg-gradient-to-br from-stone-900 to-pitch-accent w-full md:w-5/12 p-10 text-white relative flex flex-col justify-between">
                    <div className="pointer-events-none absolute -top-16 -left-16 h-48 w-48 rounded-full bg-orange-400/30 blur-[80px]" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-8 opacity-80">
                            <ShieldCheck className="h-5 w-5" />
                            <span className="text-sm font-bold uppercase tracking-wider">Secured Checkout</span>
                        </div>
                        <h2 className="text-3xl font-extrabold mb-2">{title}</h2>
                        <p className="text-stone-300 mb-8 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/20">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-stone-300">Total due today</span>
                            <span className="text-3xl font-black">${price}</span>
                        </div>
                        <p className="text-xs text-stone-400">Includes all applicable tax. Powered by MockStripe™</p>
                    </div>
                </div>

                {/* Right Side Form (Mock) */}
                <div className="w-full md:w-7/12 p-10 bg-white">
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-stone-900 mb-1">Payment Method</h3>
                        <p className="text-stone-500 text-sm">Enter your credit card details.</p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">Card Information</label>
                            <div className="rounded-xl border border-stone-200 bg-stone-50 overflow-hidden focus-within:border-pitch-accent focus-within:ring-2 focus-within:ring-orange-200 transition-all">
                                <div className="p-3 border-b border-stone-200 flex items-center bg-white">
                                    <CreditCard className="h-5 w-5 text-stone-400 mr-3" />
                                    <input 
                                        type="text" 
                                        placeholder="0000 0000 0000 0000" 
                                        className="w-full bg-transparent outline-none text-stone-800 placeholder:text-stone-300"
                                    />
                                </div>
                                <div className="flex">
                                    <div className="p-3 border-r border-stone-200 w-1/2 bg-white">
                                        <input 
                                            type="text" 
                                            placeholder="MM / YY" 
                                            className="w-full bg-transparent outline-none text-stone-800 placeholder:text-stone-300"
                                        />
                                    </div>
                                    <div className="p-3 w-1/2 bg-white">
                                        <input 
                                            type="text" 
                                            placeholder="CVC" 
                                            className="w-full bg-transparent outline-none text-stone-800 placeholder:text-stone-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">Name on card</label>
                            <input 
                                type="text" 
                                placeholder="Founders Name" 
                                className="w-full rounded-xl border border-stone-200 p-3 outline-none focus:border-pitch-accent focus:ring-2 focus:ring-orange-200 transition-all text-stone-800"
                            />
                        </div>

                        <button
                            onClick={handlePay}
                            disabled={status === 'processing'}
                            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-stone-900 py-4 font-bold text-white transition-all hover:bg-stone-800 active:scale-[0.98] disabled:opacity-80 shadow-lg shadow-stone-900/20"
                        >
                            {status === 'processing' ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" /> Processing Payment...
                                </>
                            ) : (
                                <>
                                    Pay ${price} <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                        
                        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs font-medium text-stone-500">
                            <Lock className="h-3 w-3" /> Payments are secure and encrypted.
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
