import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your Glow & Grace concierge. How can I make your day more beautiful? ✨" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const bodyRef = useRef(null);

    const quickChips = ['haircut services', 'Pricing', 'View all services', 'Payment Process'];

    useEffect(() => {
        if (bodyRef.current) {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const sendMessage = async (text) => {
        const msg = text || input;
        if (!msg.trim()) return;

        const userMsg = { role: 'user', content: msg };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const res = await fetch(`${apiUrl}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ message: msg, userId: 'guest-123' }),
            });
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            const data = await res.json();
            const botReply = data.reply || data.output || data.text || data.message || (typeof data === 'string' ? data : 'No reply content');
            setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Agent is sleeping. Try again in a moment.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Google Fonts */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
            `}</style>

            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ opacity: 0, y: 40, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.94 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                            className="w-[360px] mb-3 overflow-hidden rounded-[24px]"
                            css={`
                                background: rgba(255,255,255,0.82);
                                backdrop-filter: blur(24px);
                                border: 0.5px solid rgba(212,83,126,0.18);
                                box-shadow: 0 32px 64px rgba(83,74,183,0.12), 0 8px 24px rgba(212,83,126,0.08), inset 0 0.5px 0 rgba(255,255,255,0.9);
                                animation: floatChat 3.5s ease-in-out infinite;
                            `}
                        >
                            {/* Use inline style for cross-browser backdrop + animation */}
                            <div
                                style={{
                                    background: 'rgba(255,255,255,0.82)',
                                    backdropFilter: 'blur(24px)',
                                    WebkitBackdropFilter: 'blur(24px)',
                                    border: '0.5px solid rgba(212,83,126,0.18)',
                                    boxShadow: '0 32px 64px rgba(83,74,183,0.12), 0 8px 24px rgba(212,83,126,0.08), inset 0 0.5px 0 rgba(255,255,255,0.9)',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    animation: 'floatChat 3.5s ease-in-out infinite',
                                }}
                            >
                                <style>{`
                                    @keyframes floatChat {
                                        0%, 100% { transform: translateY(0px); }
                                        50% { transform: translateY(-7px); }
                                    }
                                    @keyframes pulseDot {
                                        0%, 100% { opacity: 1; }
                                        50% { opacity: 0.35; }
                                    }
                                    @keyframes bounceDots {
                                        0%, 60%, 100% { transform: translateY(0); }
                                        30% { transform: translateY(-5px); }
                                    }
                                    .gc-scrollbar::-webkit-scrollbar { width: 3px; }
                                    .gc-scrollbar::-webkit-scrollbar-track { background: transparent; }
                                    .gc-scrollbar::-webkit-scrollbar-thumb { background: rgba(212,83,126,0.2); border-radius: 4px; }
                                `}</style>

                                {/* Header */}
                                <div style={{
                                    background: 'linear-gradient(135deg, #2C2166 0%, #533AB7 60%, #D4537E 100%)',
                                    padding: '18px 20px 16px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{ position: 'absolute', top: '-40%', right: '-5%', width: 120, height: 120, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ position: 'relative', width: 36, height: 36, border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}>
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', boxShadow: '0 0 6px rgba(255,255,255,0.6)' }} />
                                            <div style={{ position: 'absolute', bottom: 1, right: 1, width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 5px #4ade80', animation: 'pulseDot 2s infinite' }} />
                                        </div>
                                        <div>
                                            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.95)', letterSpacing: '0.02em' }}>Glow & Grace</div>
                                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 300, letterSpacing: '0.04em' }}>Your beauty concierge · Online</div>
                                        </div>
                                        <button onClick={() => setIsOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, color: 'white', padding: 4 }}>
                                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div ref={bodyRef} className="gc-scrollbar" style={{ height: 320, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <div style={{ fontSize: 10, textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(127,119,221,0.45)', marginBottom: 4 }}>Today</div>
                                    <AnimatePresence initial={false}>
                                        {messages.map((m, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                transition={{ duration: 0.25, ease: 'easeOut' }}
                                                style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}
                                            >
                                                <div style={{
                                                    padding: '10px 14px',
                                                    borderRadius: 18,
                                                    fontSize: 13,
                                                    lineHeight: 1.5,
                                                    ...(m.role === 'user'
                                                        ? { background: 'linear-gradient(135deg, #533AB7, #D4537E)', color: 'rgba(255,255,255,0.95)', borderBottomRightRadius: 4, boxShadow: '0 4px 12px rgba(83,74,183,0.25)' }
                                                        : { background: 'rgba(255,255,255,0.75)', border: '0.5px solid rgba(212,83,126,0.12)', color: '#2C2166', borderBottomLeftRadius: 4, boxShadow: '0 2px 8px rgba(83,74,183,0.06)' }
                                                    )
                                                }}>
                                                    {m.content}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {isLoading && (
                                        <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: 'rgba(255,255,255,0.75)', border: '0.5px solid rgba(212,83,126,0.12)', borderRadius: 18, borderBottomLeftRadius: 4, alignSelf: 'flex-start', width: 'fit-content' }}>
                                            {[0, 0.2, 0.4].map((d, i) => (
                                                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(127,119,221,0.6)', animation: `bounceDots 1.2s ${d}s infinite` }} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Quick chips */}
                                <div style={{ display: 'flex', gap: 6, padding: '6px 14px 0', overflowX: 'auto', scrollbarWidth: 'none' }}>
                                    {quickChips.map(chip => (
                                        <button key={chip} onClick={() => sendMessage(chip)} style={{ whiteSpace: 'nowrap', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 300, border: '0.5px solid rgba(127,119,221,0.25)', color: 'rgba(83,74,183,0.8)', cursor: 'pointer', background: 'rgba(255,255,255,0.7)', letterSpacing: '0.02em', fontFamily: "'DM Sans', sans-serif" }}>
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                                {/* Input */}
                                <div style={{ padding: '10px 12px 12px', display: 'flex', gap: 8, alignItems: 'center', borderTop: '0.5px solid rgba(212,83,126,0.1)', background: 'rgba(255,255,255,0.55)' }}>
                                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.8)', border: '0.5px solid rgba(127,119,221,0.2)', borderRadius: 14, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <input
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                            placeholder="Ask about our services..."
                                            style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 12.5, fontFamily: "'DM Sans', sans-serif", color: '#2C2166', outline: 'none' }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => sendMessage()}
                                        style={{ width: 38, height: 38, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #533AB7, #D4537E)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(83,74,183,0.3)' }}
                                    >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* FAB toggle */}
                <motion.button
                    onClick={() => setIsOpen(o => !o)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    style={{ width: 52, height: 52, borderRadius: 16, border: 'none', background: 'linear-gradient(135deg, #533AB7, #D4537E)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(83,74,183,0.35)', marginLeft: 'auto', animation: 'floatChat 3.5s ease-in-out infinite' }}
                >
                    {isOpen
                        ? <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        : <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    }
                </motion.button>
            </motion.div>
        </>
    );
};