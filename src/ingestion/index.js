import { connectDB } from "../config/mongooseConfig.js";
import { fetchAndStoreJobs } from "./arbeitnowService.js";

async function runIngestion() {
  try {
    await connectDB();

    const result = await fetchAndStoreJobs();

    if (!result.success) {
      console.error("❌ Ingesta fallida:", result.error);
    } else {
      console.log(`✅ Ingesta completada correctamente. Total procesadas: ${result.jobs}`);
    }

  } catch (error) {
    console.error("❌ Error en el proceso de ingesta:", error.message);
  } finally {
    process.exit(0);
  }
}

runIngestion();