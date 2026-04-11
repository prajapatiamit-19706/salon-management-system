import twilio from "twilio";

export const sendWhatsApp = async (to, message) => {
    if (!to) return;

    try {
        const client = twilio(
            process.env.TWILIO_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        // Sanitize phone input: remove spaces, dashes, parentheses
        const formattedPhone = to.replace(/[-()\s]/g, "");

        // Ensure the phone number has a country code (defaults to +91 if none is provided)
        const finalPhone = formattedPhone.startsWith("+") ? formattedPhone : `+91${formattedPhone}`;

        await client.messages.create({
            body: message,
            from: "whatsapp:+14155238886", // Twilio sandbox number
            to: `whatsapp:${finalPhone}`
        });

    } catch (error) {
        console.error("WhatsApp Error:", error.message);
    }
};