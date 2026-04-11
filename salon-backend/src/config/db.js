import mongoose from "mongoose";

const connectDB = async () => {
 try {
      const con = await mongoose.connect(process.env.MONGO_URI);

      console.log(`MongoDB Connected : ${con.connection.host}`);
      
 } catch (error) {
     console.error("MongoDB connection failed:", error.message);
     process.exit(1); // stop app if DB fails
 }
};

export default connectDB;
