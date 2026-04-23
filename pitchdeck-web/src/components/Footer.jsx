import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="w-full bg-[#0a0a0f] text-white py-16 px-6 mt-auto">
            <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-2xl font-black mb-4 tracking-tight">Pitch<span className="text-pitch-accent">Deck</span> India</h3>
                <p className="text-stone-400 font-medium pt-2">Built for India's next generation of founders.</p>
                <p className="text-stone-400 font-medium mb-8">From Tier-1 metros to Tier-3 towns — your idea matters here.</p>
                
                <div className="flex flex-wrap justify-center gap-6 font-medium text-stone-300 mb-12 text-sm md:text-base">
                    <Link to="/feed" className="hover:text-white transition-colors">Browse Ideas</Link>
                    <Link to="/submit" className="hover:text-white transition-colors">Submit Idea</Link>
                    <Link to="/cofounders" className="hover:text-white transition-colors">Find Co-founder</Link>
                    <Link to="/playbook" className="hover:text-white transition-colors">Blog</Link>
                    <Link to="#" className="hover:text-white transition-colors">About</Link>
                </div>
                
                <p className="text-stone-600 text-sm">© 2026 PitchDeck India</p>
            </div>
        </footer>
    );
}
