import axios from "axios";
import Chat from "../models/chat.model.js";

export const handleChat = async (req, res) => {
    const { message, userId } = req.body;

    try {
        // 1. Send to n8n Webhook
        const n8nResponse = await axios.post(process.env.N8N_WEBHOOK_URL, {
            message,
            userId
        });

        const botReply = n8nResponse.data.output;

        // 2. Optional: Save to your MongoDB for analytics
        await Chat.findOneAndUpdate(
            { userId },
            { $push: { messages: [{ role: 'user', content: message }, { role: 'assistant', content: botReply }] } },
            { upsert: true }
        );

        res.status(200).json({ reply: botReply });
    } catch (error) {
        res.status(500).json({ error: "Agent connection failed" });
    }
};