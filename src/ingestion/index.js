import { connectDB } from "../config/mongooseConfig.js";
import { fetchAndStoreJobs } from "./arbeitnowService.js";

async function runIngestion() {
  try {
    await connectDB();

    await fetchAndStoreJobs();

    console.log("✅ Ingesta completada correctamente");
  } catch (error) {
    console.error("❌ Error en el proceso de ingesta:", error);
  } finally {
    process.exit(0);
  }
}

// Lanzamos la ingesta
runIngestion();