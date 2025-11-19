import { fetchAndStoreJobs } from "./service/arbeitnowService.js";
import { connectDB, logger } from "@talentscope/shared";
import "./cron.js";

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
