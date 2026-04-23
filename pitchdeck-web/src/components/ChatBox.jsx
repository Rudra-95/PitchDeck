import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { MessageCircle, X, Send, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

let socket;

export default function ChatBox() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to Deal Flow Messaging! As an investor or founder, you can chat globally here in real-time.", isSystem: true }
    ]);
    const [inputMsg, setInputMsg] = useState('');
    const token = localStorage.getItem('pitchdeck_token');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!token) return;

        const SOCKET_URL = import.meta.env.VITE_API_BASE_URL 
            ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') 
            : 'http://localhost:5000';

        socket = io(SOCKET_URL, {
            auth: { token }
        });

        socket.on('receive_message', (data) => {
            setMessages((prev) => [...prev, { ...data, isMine: false, id: Date.now() }]);
        });

        return () => {
            if (socket) socket.disconnect();
        };
    }, [token]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (inputMsg.trim() !== '' && socket) {
            const msgData = {
                text: inputMsg,
                sender: 'Me',
                timestamp: new Date().toISOString()
            };
            socket.emit('send_message', msgData);
            setMessages((prev) => [...prev, { ...msgData, isMine: true, id: Date.now() }]);
            setInputMsg('');
        }
    };

    if (!token) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-80 sm:w-96 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl flex flex-col"
                        style={{ height: '500px', maxHeight: '70vh' }}
                    >
                        {/* Chat Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-pitch-accent to-orange-500 px-4 py-3 text-white">
                            <div className="flex items-center gap-2 font-bold z-10 w-full relative">
                                <MessageCircle className="h-5 w-5" />
                                <span>Deal Flow Inlet</span>
                                <span className="ml-auto flex items-center text-xs bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">
                                    <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full mr-1.5 animate-pulse" /> Live
                                </span>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 bg-stone-50/50 space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.isMine ? 'items-end' : msg.isSystem ? 'items-center' : 'items-start'}`}>
                                    {msg.isSystem ? (
                                        <div className="bg-amber-100/80 border border-amber-200 text-amber-900 text-xs py-1.5 px-3 rounded-xl max-w-[85%] text-center shadow-sm">
                                            <Sparkles className="h-3 w-3 inline mr-1 text-amber-500" />
                                            {msg.text}
                                        </div>
                                    ) : (
                                        <div className={`flex flex-col max-w-[80%] ${msg.isMine ? 'items-end' : 'items-start'}`}>
                                            {!msg.isMine && <span className="text-[10px] text-stone-400 font-bold ml-1 mb-0.5 uppercase tracking-wider">{msg.sender}</span>}
                                            <div
                                                className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                                                    msg.isMine
                                                        ? 'bg-gradient-to-br from-pitch-accent to-orange-600 text-white rounded-tr-sm font-medium'
                                                        : 'bg-white border border-stone-200 text-stone-800 rounded-tl-sm'
                                                }`}
                                            >
                                                {msg.text}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <form onSubmit={sendMessage} className="border-t border-stone-100 bg-white p-3 flex gap-2">
                            <input
                                type="text"
                                value={inputMsg}
                                onChange={(e) => setInputMsg(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-pitch-accent focus:bg-white transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!inputMsg.trim()}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <Send className="h-4 w-4 -ml-0.5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-stone-900 to-stone-800 text-white shadow-xl shadow-stone-900/30 transition-transform hover:scale-105 active:scale-95 border-2 border-white/10"
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
            </button>
        </div>
    );
}
