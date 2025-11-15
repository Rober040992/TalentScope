import { connectDB } from "../config/mongooseConfig.js";
import { fetchAndStoreJobs } from "./arbeitnowService.js";
import { logger } from "../logger/logger.js";

async function runIngestion() {
  try {
    await connectDB();

    const result = await fetchAndStoreJobs();

    if (!result.success) {
      logger.error(`Ingesta fallida: ${result.error}`);
    } else {
      logger.info(`Ingesta completada correctamente. Total procesadas: ${result.jobs}`);
    }
  } catch (error) {
    logger.error(`Error en el proceso de ingesta: ${error.message}`);
  } finally {
    process.exit(0);
  }
}

runIngestion();
