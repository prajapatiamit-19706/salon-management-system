import axios from "axios";
import Chat from "../models/chat.model.js";

export const handleChat = async (req, res) => {
    const { message, userId } = req.body;

    // 1. Validate Input
    if (!message || !userId) {
        return res.status(400).json({ error: "Message and userId are required." });
    }

    try {
        // 2. Send to n8n Webhook with a timeout to prevent hanging
        const n8nResponse = await axios.post(process.env.N8N_WEBHOOK_URL,
            { message, userId },
            { timeout: 30000 } // 30 second timeout for AI processing
        );

        // 3. Robust Data Extraction
        // This checks for 'output', then 'reply', then 'message' in case n8n structure changes
        const botReply = n8nResponse.data?.output ||
            n8nResponse.data?.reply ||
            n8nResponse.data?.[0]?.output ||
            "I'm sorry, I couldn't process that right now.";

        // 4. Save to MongoDB (Don't let DB errors stop the response)
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
            console.error("MongoDB Save Error:", dbError);
            // We continue anyway so the user gets their reply
        }

        // 5. Final Success Response
        return res.status(200).json({ reply: botReply });

    } catch (error) {
        console.error("n8n/Controller Error:", error.message);

        // Detailed error for debugging
        const errorMessage = error.response?.data?.message || "Agent connection failed";
        return res.status(500).json({
            error: errorMessage,
            details: "Ensure n8n workflow is active and URL is correct."
        });
    }
};