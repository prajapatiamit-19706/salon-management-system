import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "../models/chat.model.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System prompt — customize this for your salon
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

    // 1. Validate Input
    if (!message || !userId) {
        return res.status(400).json({ error: "Message and userId are required." });
    }

    try {
        // 2. Fetch previous chat history from MongoDB
        let chatHistory = [];
        try {
            const existingChat = await Chat.findOne({ userId });
            if (existingChat && existingChat.messages.length > 0) {
                // Convert to Gemini format — last 10 messages only (to save tokens)
                chatHistory = existingChat.messages
                    .slice(-10)
                    .map(msg => ({
                        role: msg.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: msg.content }]
                    }));
            }
        } catch (dbError) {
            console.error("MongoDB fetch error:", dbError);
            // Continue without history
        }

        // 3. Initialize Gemini model
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SALON_SYSTEM_PROMPT,
        });

        // 4. Start chat session with history
        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        // 5. Send message and get response
        const result = await chat.sendMessage(message);
        const botReply = result.response.text();

        console.log("Gemini reply:", botReply);

        // 6. Save to MongoDB
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
            );
        } catch (dbError) {
            console.error("MongoDB save error:", dbError);
            // Continue anyway
        }

        // 7. Send response
        return res.status(200).json({ reply: botReply });

    } catch (error) {
        console.error("Gemini Error:", error.message);
        return res.status(500).json({
            error: "AI service error",
            details: error.message
        });
    }
};