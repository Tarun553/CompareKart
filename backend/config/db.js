import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongoose connection successful");
  } catch (error) {
    console.log("Mongoose connection error", error);
    process.exit(1);
  }
};

export default dbConnect;