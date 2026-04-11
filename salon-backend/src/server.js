import "dotenv/config";

import connectDB from "./config/db.js";
import app from "./app.js"
import { startAutoCompleteCron } from "./cron/autoCompleteAppointments.js";

// database connectivity
connectDB();

const PORT =  process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`server is running on port number ${PORT}`);
    // Start cron job for auto-completing expired appointments
    startAutoCompleteCron();
})