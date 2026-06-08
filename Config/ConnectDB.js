import mongoose from "mongoose";

async function connectDB() {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is not set!");
    }
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1); // server band kar do agar DB connect na ho
  }
}

export default connectDB;
