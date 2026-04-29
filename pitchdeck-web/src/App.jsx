import { motion } from 'framer-motion';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import ChatBox from './components/ChatBox';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import ArticleDetail from './pages/ArticleDetail';
import Auth from './pages/Auth';
import CheckoutSimulation from './pages/CheckoutSimulation';
import CoFounderMatch from './pages/CoFounderMatch';
import Feed from './pages/Feed';
import FounderDNA from './pages/FounderDNA';
import IdeaBattle from './pages/IdeaBattle';
import IdeaDetail from './pages/IdeaDetail';
import InvestorPortal from './pages/InvestorPortal';
import Landing from './pages/Landing';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';
import Playbook from './pages/Playbook';
import Profile from './pages/Profile';
import StressTester from './pages/StressTester';
import SubmitIdea from './pages/SubmitIdea';

function App() {
  return (
    <Router>
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#faf9f6] text-stone-900 font-sans">
        {/* Subtle Architectural Notebook Grid Overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ece8e1 1px, transparent 1px), linear-gradient(to bottom, #ece8e1 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, rgba(15, 23, 40, 0.06) 0, transparent 18%), radial-gradient(circle at 85% 30%, rgba(15, 23, 40, 0.05) 0, transparent 16%), radial-gradient(circle at 40% 80%, rgba(15, 23, 40, 0.05) 0, transparent 20%)',
            opacity: 0.65,
            mixBlendMode: 'multiply',
          }}
        />

        {/* Spectacular Full-Screen Splashing Core Colors */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="absolute -top-[10%] left-[5%] h-[800px] w-[800px] rounded-[100%] bg-gradient-to-br from-amber-500 to-orange-600 opacity-[0.22] blur-[120px]"
            />
            <motion.div
                animate={{ scale: [1, 1.1, 1], x: [0, -50, 0], y: [0, 80, 0] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute right-[-5%] top-[15%] h-[900px] w-[900px] rounded-full bg-gradient-to-bl from-rose-500 to-indigo-600 opacity-[0.18] blur-[140px]"
            />
            <motion.div
                animate={{ scale: [1, 1.15, 1], x: [0, 60, 0], y: [0, -60, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                className="absolute left-[20%] top-[30%] h-[700px] w-[700px] rounded-full bg-gradient-to-t from-fuchsia-500 to-pink-500 opacity-[0.15] blur-[130px]"
            />
            {/* Extended glowing aura for deep scroll pages */}
            <motion.div
                animate={{ scale: [1, 1.25, 1], x: [0, -40, 0], y: [0, -40, 0] }}
                transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-[20%] right-[10%] h-[950px] w-[950px] rounded-full bg-gradient-to-t from-orange-400 to-rose-400 opacity-[0.16] blur-[150px]"
            />
        </div>

        <Navbar />
        <ChatBox />

        <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-8">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/ideas/:id" element={<IdeaDetail />} />
            <Route path="/submit" element={<SubmitIdea />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/cofounders" element={<CoFounderMatch />} />
            <Route path="/founder-dna" element={<FounderDNA />} />
            <Route path="/battle" element={<IdeaBattle />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/checkout" element={<CheckoutSimulation />} />
            <Route path="/investors" element={<InvestorPortal />} />
            <Route path="/playbook" element={<Playbook />} />
            <Route path="/playbook/:id" element={<ArticleDetail />} />
            <Route path="/stress-test" element={<StressTester />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
