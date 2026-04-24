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
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ message: input, userId: 'guest-123' }),
            });

            // Check if the response is actually OK (status 200-299)
            if (!res.ok) {
                const errorText = await res.text();
                console.error("Server Error:", errorText);
                throw new Error(`Server responded with ${res.status}`);
            }

            const data = await res.json();

            // Logic to extract the message regardless of the key name
            const botReply = data.reply || data.output || data.message || (typeof data === 'string' ? data : "No reply content");

            setMessages(prev => [...prev, { role: 'assistant', content: botReply }]);
        } catch (error) {
            console.error("Fetch error details:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Agent is sleeping. Try again in a moment." }]);
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