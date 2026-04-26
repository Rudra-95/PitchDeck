import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, LayoutDashboard, LogIn, Menu, PlusCircle, Rocket, Sparkles, Trophy, UserCircle, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { Button } from './ui/Button';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('pitchdeck_token');
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (token) {
            api.get('/auth/me')
                .then((res) => setUser(res.data.user))
                .catch(() => {
                    localStorage.removeItem('pitchdeck_token');
                    setUser(null);
                });
        }
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('pitchdeck_token');
        setUser(null);
        setIsMobileOpen(false);
        navigate('/');
    };

    const closeMobileMenu = () => setIsMobileOpen(false);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                className={`sticky top-4 z-50 mx-auto mt-4 flex w-full max-w-7xl items-center justify-between rounded-2xl px-6 py-4 transition-all duration-500 ${
                    scrolled
                        ? 'glass-panel border-orange-200/80 shadow-md shadow-orange-200/20'
                        : 'border border-transparent bg-white/40 shadow-sm backdrop-blur-md'
                }`}
            >
                <Link to="/" className="group flex items-center gap-2">
                    <Rocket className="h-8 w-8 text-pitch-accent transition-transform duration-300 group-hover:scale-105" />
                    <span className="text-xl font-extrabold tracking-tight text-stone-900">
                        Pitch<span className="text-pitch-accent">Deck</span>
                    </span>
                </Link>

                <div className="hidden items-center gap-6 font-medium text-stone-600 md:flex">
                    <Link
                        to="/feed"
                        className="flex items-center gap-2 transition-colors duration-300 hover:text-pitch-accent"
                        onClick={closeMobileMenu}
                    >
                        <LayoutDashboard className="h-4 w-4" /> Feed
                    </Link>
                    <Link
                        to="/playbook"
                        className="flex items-center gap-2 transition-colors duration-300 hover:text-pitch-accent"
                        onClick={closeMobileMenu}
                    >
                        <BookOpen className="h-4 w-4" /> Playbook
                    </Link>
                    <Link
                        to="/stress-test"
                        className="flex items-center gap-1.5 transition-colors duration-300 font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent hover:scale-105"
                        onClick={closeMobileMenu}
                    >
                        🤖 AI Stress Test
                    </Link>
                    <Link
                        to="/founder-dna"
                        className="flex items-center gap-2 transition-colors duration-300 hover:text-pitch-accent"
                        onClick={closeMobileMenu}
                    >
                        <Users className="h-4 w-4" /> Founder DNA
                    </Link>
                    <Link
                        to="/battle"
                        className="flex items-center gap-2 transition-colors duration-300 hover:text-pitch-accent"
                        onClick={closeMobileMenu}
                    >
                        <Sparkles className="h-4 w-4" /> Idea Battle
                    </Link>
                    <Link
                        to="/leaderboard"
                        className="flex items-center gap-2 transition-colors duration-300 hover:text-pitch-accent"
                        onClick={closeMobileMenu}
                    >
                        <Trophy className="h-4 w-4" /> Leaderboard
                    </Link>
                    <Link
                        to="/cofounders"
                        className="flex items-center gap-2 transition-colors duration-300 hover:text-pitch-accent"
                        onClick={closeMobileMenu}
                    >
                        <Users className="h-4 w-4" /> Co-founders
                    </Link>
                    {token ? (
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 transition-colors duration-300 hover:text-pitch-accent"
                            onClick={closeMobileMenu}
                        >
                            <UserCircle className="h-4 w-4" /> Profile
                        </Link>
                    ) : null}
                </div>

                <div className="hidden items-center gap-4 md:flex">
                    {token ? (
                        <div className="flex items-center gap-4">
                            <Link to="/submit">
                                <Button variant="primary" className="gap-2 px-4 py-2">
                                    <PlusCircle className="h-4 w-4" /> Submit Idea
                                </Button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-sm font-medium text-stone-500 transition-colors duration-300 hover:text-pitch-accent"
                            >
                                Logout
                            </button>
                            {user && (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-amber-200 shadow-inner font-bold text-pitch-accent border border-orange-300/50">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/auth"
                                state={{ register: false }}
                                className="text-sm font-medium text-stone-700 transition-colors duration-300 hover:text-pitch-accent"
                            >
                                Login
                            </Link>
                            <Link to="/auth" state={{ register: true }}>
                                <Button variant="outline" className="gap-2">
                                    <LogIn className="h-4 w-4" /> Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                <button
                    className="flex items-center gap-3 text-stone-600 transition-colors hover:text-pitch-accent md:hidden"
                    onClick={() => setIsMobileOpen((prev) => !prev)}
                    aria-label="Toggle navigation menu"
                >
                    {token && user && !scrolled && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-200 font-bold text-pitch-accent text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </motion.nav>

            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                        className="mx-auto mt-2 w-full max-w-7xl px-4 md:hidden"
                    >
                        <div className="glass-panel space-y-3 rounded-2xl p-4">
                            <Link
                                to="/feed"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-stone-700 hover:bg-orange-50/80"
                                onClick={closeMobileMenu}
                            >
                                <LayoutDashboard className="h-4 w-4" /> Feed
                            </Link>
                            <Link
                                to="/playbook"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-stone-700 hover:bg-orange-50/80"
                                onClick={closeMobileMenu}
                            >
                                <BookOpen className="h-4 w-4" /> Playbook
                            </Link>
                            <Link
                                to="/stress-test"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-orange-600 font-bold bg-orange-50/80"
                                onClick={closeMobileMenu}
                            >
                                🤖 AI Stress Test
                            </Link>
                            <Link
                                to="/founder-dna"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-stone-700 hover:bg-orange-50/80"
                                onClick={closeMobileMenu}
                            >
                                <Users className="h-4 w-4" /> Founder DNA
                            </Link>
                            <Link
                                to="/battle"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-stone-700 hover:bg-orange-50/80"
                                onClick={closeMobileMenu}
                            >
                                <Sparkles className="h-4 w-4" /> Idea Battle
                            </Link>
                            <Link
                                to="/leaderboard"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-stone-700 hover:bg-orange-50/80"
                                onClick={closeMobileMenu}
                            >
                                <Trophy className="h-4 w-4" /> Leaderboard
                            </Link>
                            <Link
                                to="/cofounders"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-stone-700 hover:bg-orange-50/80"
                                onClick={closeMobileMenu}
                            >
                                <Users className="h-4 w-4" /> Co-founders
                            </Link>
                            {token ? (
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-stone-700 hover:bg-orange-50/80"
                                    onClick={closeMobileMenu}
                                >
                                    <UserCircle className="h-4 w-4" /> Profile
                                </Link>
                            ) : null}
                            {token ? (
                                <div className="grid grid-cols-1 gap-2 pt-1 border-t border-orange-100">
                                    <Link to="/submit" onClick={closeMobileMenu} className="mt-2">
                                        <Button variant="primary" className="w-full gap-2">
                                            <PlusCircle className="h-4 w-4" /> Submit Idea
                                        </Button>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="rounded-lg px-3 py-2 text-left text-stone-600 hover:bg-orange-50/80 hover:text-pitch-accent w-full"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-orange-100 mt-2">
                                    <Link to="/auth" state={{ register: false }} onClick={closeMobileMenu} className="w-full mt-2">
                                        <Button variant="secondary" className="w-full">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/auth" state={{ register: true }} onClick={closeMobileMenu} className="w-full mt-2">
                                        <Button variant="outline" className="w-full">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
