// Archivo dedicado EXCLUSIVAMENTE al CRON JOB de ingesta automática
// Ejecuta la ingesta semanal

import cron from "node-cron";
import { fetchAndStoreJobs } from "./service/fetchArbeitnowPage.js";
import { logger } from "@talentscope/shared";

cron.schedule("0 3 * * 1", async () => {
  logger.info("⏰ Ejecutando CRON de ingesta automática...");

  try {
    const result = await fetchAndStoreJobs();
    logger.info(`CRON OK: ${result.jobs} ofertas procesadas`);
  } catch (err) {
    logger.error(`CRON ERROR: ${err.message}`);
  }
});

export {};