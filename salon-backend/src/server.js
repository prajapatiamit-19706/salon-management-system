import "dotenv/config";

import connectDB from "./config/db.js";
import app from "./app.js"
import { startAutoCompleteCron } from "./cron/autoCompleteAppointments.js";
import axios from "axios";

// database connectivity
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`server is running on port number ${PORT}`);
    // Start cron job for auto-completing expired appointments
    startAutoCompleteCron();
})


// paste this at the bottom of server.js, after app.listen()
const BACKEND_URL = process.env.VITE_API_URL || 'https://salon-management-system-j1tm.onrender.com';

setInterval(async () => {
    try {
        await axios.get(`${BACKEND_URL}/api/health`);
        console.log('Self-ping ✅ server awake');
    } catch (err) {
        console.log('Self-ping failed:', err.message);
    }
}, 14 * 60 * 1000); // every 14 minutes