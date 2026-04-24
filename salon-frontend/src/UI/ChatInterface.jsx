import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('https://salon-management-system-j1tm.onrender.com/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input, userId: 'guest-123' }),
            });

            const data = await res.json();

            // DEBUG: This will show you exactly what the agent is sending in your console
            console.log("Agent Data:", data);

            // Fallback chain: Check for 'reply', then 'output', then 'message'
            const agentText = data.reply || data.output || data.message || "I'm sorry, I couldn't process that.";

            setMessages(prev => [...prev, { role: 'assistant', content: agentText }]);
        } catch (err) {
            console.error("Connection Error:", err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Connection lost. Please check if the backend is running." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 w-96 bg-white/80 backdrop-blur-md shadow-2xl rounded-2xl border border-gray-100 overflow-hidden font-sans">
            <div className="p-4 bg-bg-dark text-white font-medium tracking-wide">Glow & Grace AI</div>

            <div className="h-96 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((m, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={i}
                            className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'ml-auto bg-bg-dark text-white' : 'mr-auto bg-gray-100 text-gray-800'}`}
                        >
                            {m.content}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isLoading && <div className="text-xs text-gray-400 animate-pulse">Agent is thinking...</div>}
            </div>

            <div className="p-4 border-t border-gray-100 flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Ask about our services..."
                    className="flex-1 bg-gray-50 border-none focus:ring-0 text-sm p-2 rounded-md"
                />
                <button onClick={sendMessage} className="bg-bg-dark text-white px-4 py-2 rounded-md text-sm">Send</button>
            </div>
        </div>
    );
}