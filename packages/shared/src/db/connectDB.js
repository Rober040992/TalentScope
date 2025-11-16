import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../logger/logger.js";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("MongoDB conectado correctamente");
  } catch (error) {
    logger.error(`😅 Error al conectar MongoDB: ${error}`);
    process.exit(1);
  }
};
