import Groq from "groq-sdk";
import Chat from "../models/chat.model.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SALON_SYSTEM_PROMPT = `You are a helpful AI assistant for "Glow & Grace" salon. 
You help customers with:
- Booking appointments
- Information about services (haircut, facial, nail art, threading, waxing, etc.)
- Pricing details
- Working hours and location
- General beauty advice

Salon Details:
- Name: Glow & Grace
- Services: Haircut, Hair Color, Facial, Cleanup, Waxing, Threading, Nail Art, Manicure, Pedicure
- Hours: Monday-Saturday 9AM to 8PM, Sunday 10AM to 6PM
- Location: [Your Location]
- Phone: [Your Phone]

Always be friendly, professional and helpful. Keep responses concise and clear.
If asked about booking, guide them to use the booking system on the website.
Do not answer questions unrelated to the salon or beauty services.`;

export const handleChat = async (req, res) => {
    const { message, userId } = req.body;

    if (!message || !userId) {
        return res.status(400).json({ error: "Message and userId are required." });
    }

    try {
        // 1. Fetch previous chat history from MongoDB
        let chatHistory = [];
        try {
            const existingChat = await Chat.findOne({ userId });
            if (existingChat && existingChat.messages.length > 0) {
                // Groq uses 'assistant' not 'model' — last 10 messages only
                chatHistory = existingChat.messages
                    .slice(-10)
                    .map(msg => ({
                        role: msg.role === 'assistant' ? 'assistant' : 'user',
                        content: msg.content
                    }));
            }
        } catch (dbError) {
            console.error("MongoDB fetch error:", dbError);
        }

        // 2. Build messages array for Groq
        // System prompt first, then history, then new message
        const messages = [
            { role: 'system', content: SALON_SYSTEM_PROMPT },
            ...chatHistory,
            { role: 'user', content: message }
        ]

        // 3. Call Groq API
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages,
            temperature: 0.7,
            max_tokens: 500,
        })

        const botReply = response.choices[0]?.message?.content?.trim()

        if (!botReply) {
            return res.status(500).json({ error: "No response from AI" })
        }

        console.log("Groq reply:", botReply)

        // 4. Save to MongoDB
        try {
            await Chat.findOneAndUpdate(
                { userId },
                {
                    $push: {
                        messages: [
                            { role: 'user', content: message },
                            { role: 'assistant', content: botReply }
                        ]
                    }
                },
                { upsert: true }
            )
        } catch (dbError) {
            console.error("MongoDB save error:", dbError)
        }

        // 5. Send response
        return res.status(200).json({ reply: botReply })

    } catch (error) {
        console.error("Groq Error:", error.message)
        return res.status(500).json({
            error: "AI service error",
            details: error.message
        })
    }
}