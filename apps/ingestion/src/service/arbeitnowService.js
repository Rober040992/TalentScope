// Servicio principal que orquesta:
// 1. Fetch paginado (con reintentos por 429)
// 2. Mapeo
// 3. Upsert en MongoDB
// 4. Pequeño delay entre páginas para ser amable con la API
// -------------------------------------------------------------

import { logger } from "@talentscope/shared";
import { fetchArbeitnowPage } from "./fetchArbeitnowPage.js";
import { mapArbeitnowJobs } from "./mapArbeitnowJobs.js";
import { upsertJobs } from "./upsertJobs.js";

const pause = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchAndStoreJobs() {
  try {
    let page = 1;
    let total = 0;
    const summary = { inserted: 0, updated: 0, matched: 0, totalOps: 0 };

    logger.info("Iniciando ingesta paginada...");

    while (true) {
      const apiJobs = await fetchArbeitnowPage(page);
      if (apiJobs.length === 0) break;

      const mapped = mapArbeitnowJobs(apiJobs);

      const r = await upsertJobs(mapped, page);

      total += r.total;
      summary.inserted += r.inserted;
      summary.updated += r.updated;
      summary.matched += r.matched;
      summary.totalOps += r.total;

      await pause(8000); // pequeño descanso , la api es muy estricta
      page++;
    }

    return { success: true, jobs: total, summary };
  } catch (err) {
    logger.error(err.message);
    return { success: false, error: err.message };
  }
}
