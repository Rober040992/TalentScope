// upsertJobs.js
// -------------------------------------------------------------
// Esta función se encarga ÚNICAMENTE del proceso de UPSERT.
// Recibe jobs previamente mapeados y ejecuta el bulkWrite.
// -------------------------------------------------------------

import { Job, logger } from "@talentscope/shared";

export async function upsertJobs(mappedJobs, page) {
  const ops = mappedJobs.map((j) => ({
    updateOne: {
      filter: {
        title: j.title,
        company_name: j.company_name,
        location: j.location,
      },
      update: {
        $setOnInsert: {
          title: j.title,
          company_name: j.company_name,
          location: j.location,
        },
        $set: {
          url: j.url,
          tags: j.tags,
          created_at: j.created_at,
        },
      },
      upsert: true,
    },
  }));

  try {
    await Job.bulkWrite(ops, { ordered: false });
    logger.info(`Procesadas (upsert) ${ops.length} ofertas en página ${page}`);
    return ops.length;
  } catch (error) {
    if (error.code === 11000) {
      logger.warn("Algunos empleos ya existían (duplicados ignorados)");
      return ops.length;
    } else {
      logger.error(`Error insertando en MongoDB: ${error.message}`);
      throw error;
    }
  }
}
