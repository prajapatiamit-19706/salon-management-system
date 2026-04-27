// src/controllers/chat.controller.js
import Groq from "groq-sdk";
import Chat from "../models/chat.model.js";
import Service from "../models/services.model.js";
import Staff from "../models/staff.model.js";
import Appointment from "../models/appointment.model.js";
import Feedback from "../models/feedback.model.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// convert minutes to readable time (600 → "10:00 AM")
const minsToTime = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
};

const getSalonContext = async () => {
    try {

        // 1. SERVICES — grouped by category
        const services = await Service.find({ isActive: true })
            .select("name category gender duration priceFrom description rating tags")
            .sort({ displayOrder: 1 })
            .lean();

        const grouped = {};
        services.forEach((s) => {
            if (!grouped[s.category]) grouped[s.category] = [];
            grouped[s.category].push(s);
        });

        const servicesText = Object.entries(grouped).map(([cat, items]) => {
            const list = items.map(s =>
                `  • ${s.name} (${s.gender}) — ₹${s.priceFrom}, ${s.duration} mins${s.rating ? `, ⭐${s.rating}` : ""}${s.description ? `, ${s.description}` : ""}`
            ).join("\n");
            return `${cat.toUpperCase()}:\n${list}`;
        }).join("\n\n");

        // 2. STAFF
        const staffList = await Staff.find({ isActive: true })
            .select("name role experience specialties skills gender rating bio availability")
            .lean();

        const staffText = staffList.map(s =>
            `• ${s.name} (${s.role}) — ${s.experience} yrs exp, ⭐${s.rating}/5\n` +
            `  Specialties: ${s.specialties?.join(", ") || "General"}\n` +
            `  Skills: ${s.skills?.join(", ") || "All services"}\n` +
            `  Available: ${s.availability?.join(", ") || "All days"}\n` +
            `  ${s.bio || ""}`
        ).join("\n\n");

        // 3. TODAY'S BOOKED SLOTS
        const todayStr = new Date().toISOString().split("T")[0]; // "2026-04-27"

        const todayAppointments = await Appointment.find({
            date: todayStr,
            status: "booked"
        })
            .populate("staffId", "name")
            .populate("serviceId", "name")
            .select("startTime endTime staffId serviceId")
            .lean();

        const bookedSlotsText = todayAppointments.length
            ? todayAppointments.map(a =>
                `  • ${minsToTime(a.startTime)}–${minsToTime(a.endTime)} | ${a.serviceId?.name || "Service"} | Staff: ${a.staffId?.name || "N/A"}`
            ).join("\n")
            : "  All slots are available today";

        // 4. FEEDBACK / REVIEWS
        const feedbacks = await Feedback.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("userId", "name")
            .populate("serviceId", "name")
            .populate("staffId", "name")
            .select("rating review userId serviceId staffId")
            .lean();

        const avgRating = feedbacks.length
            ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
            : "No ratings yet";

        const feedbackText = feedbacks.length
            ? feedbacks.map(f =>
                `  • ${f.userId?.name || "Customer"} gave ⭐${f.rating}/5 for ${f.serviceId?.name || "a service"} by ${f.staffId?.name || "staff"}: "${f.review || "No comment"}"`
            ).join("\n")
            : "  No reviews yet";

        // 5. PAYMENT METHODS
        const paymentsText = `
  • Cash — accepted at counter
  • UPI — Google Pay, PhonePe, Paytm (scan QR at salon)
  • Card — Visa & Mastercard accepted
  • Online — pay at time of booking on website`;

        // 6. BOOKING PROCESS
        const bookingText = `
  Step 1: Go to the Booking page on our website
  Step 2: Select your desired service
  Step 3: Choose your preferred staff member
  Step 4: Pick an available date and time slot
  Step 5: Click on Confirm and Choose your preferred payment method for payment.
           — you'll get a confirmation instantly
  Step 6: Arrive 5 minutes early
  Note: Cancellations must be made at least 2 hours in advance`;

        return {
            servicesText,
            staffText,
            bookedSlotsText,
            feedbackText,
            avgRating,
            paymentsText,
            bookingText,
            totalServices: services.length,
            totalStaff: staffList.length
        };

    } catch (error) {
        console.error("getSalonContext error:", error.message);
        return {
            servicesText: "Services data unavailable",
            staffText: "Staff data unavailable",
            bookedSlotsText: "Availability data unavailable",
            feedbackText: "No reviews yet",
            avgRating: "N/A",
            paymentsText: "Cash and UPI accepted",
            bookingText: "Please visit our website to book",
            totalServices: 0,
            totalStaff: 0
        };
    }
};

export const handleChat = async (req, res) => {
    const { message, userId } = req.body;

    if (!message || !userId) {
        return res.status(400).json({ error: "Message and userId are required." });
    }

    try {
        // 1. fetch real data from MongoDB
        const {
            servicesText,
            staffText,
            bookedSlotsText,
            feedbackText,
            avgRating,
            paymentsText,
            bookingText,
            totalServices,
            totalStaff
        } = await getSalonContext();

        // 2. build dynamic system prompt with real data
        const SALON_SYSTEM_PROMPT = `You are a friendly and professional AI assistant for "Glow & Grace" salon.
You have access to real-time data from our database. Always use this data to answer accurately.
Never guess or make up prices, staff names, or service details.
Only answer questions related to the salon and beauty services.
Keep responses concise, warm and helpful.

━━━ OUR SERVICES (${totalServices} total) ━━━
${servicesText}

━━━ OUR TEAM (${totalStaff} staff members) ━━━
${staffText}

━━━ TODAY'S BOOKED SLOTS ━━━
${bookedSlotsText}

━━━ CUSTOMER REVIEWS (latest 5 | avg: ⭐${avgRating}/5) ━━━
${feedbackText}

━━━ PAYMENT METHODS ━━━
${paymentsText}

━━━ HOW TO BOOK ━━━
${bookingText}

━━━ SALON INFO ━━━
- Name: Glow & Grace
- Hours: Monday–Saturday 9AM–8PM, Sunday 10AM–6PM
- Location: [Your Location]
- Phone: [Your Phone]
- Cancellation: At least 2 hours before appointment

RESPONSE RULES:
- If asked about price → always give exact ₹ amount from data above
- If asked about staff → recommend based on their specialties and skills
- If asked about availability → refer to today's booked slots
- If asked to book → guide them to the Booking page on the website
- If asked about reviews → mention real ratings and feedback above
- If question is unrelated to salon → politely say you only help with salon queries`;

        // 3. fetch chat history from MongoDB
        let chatHistory = [];
        try {
            const existingChat = await Chat.findOne({ userId });
            if (existingChat && existingChat.messages.length > 0) {
                chatHistory = existingChat.messages
                    .slice(-10)
                    .map((msg) => ({
                        role: msg.role === "assistant" ? "assistant" : "user",
                        content: msg.content,
                    }));
            }
        } catch (dbError) {
            console.error("MongoDB fetch error:", dbError.message);
        }

        // 4. build full messages array
        const messages = [
            { role: "system", content: SALON_SYSTEM_PROMPT },
            ...chatHistory,
            { role: "user", content: message },
        ];

        // 5. call Groq API
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages,
            temperature: 0.7,
            max_tokens: 500,
        });

        const botReply = response.choices[0]?.message?.content?.trim();

        if (!botReply) {
            return res.status(500).json({ error: "No response from AI" });
        }

        // console.log(`Chat [${userId}]: "${message}" → "${botReply.slice(0, 60)}..."`);

        // 6. save conversation to MongoDB
        try {
            await Chat.findOneAndUpdate(
                { userId },
                {
                    $push: {
                        messages: [
                            { role: "user", content: message },
                            { role: "assistant", content: botReply },
                        ],
                    },
                },
                { upsert: true }
            );
        } catch (dbError) {
            console.error("MongoDB save error:", dbError.message);
        }

        // 7. return response
        return res.status(200).json({ reply: botReply });

    } catch (error) {
        console.error("Groq Error:", error.message);
        return res.status(500).json({
            error: "AI service error",
            details: error.message,
        });
    }
};