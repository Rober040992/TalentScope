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
    const result = await Job.bulkWrite(ops, { ordered: false });

    const inserted = result.upsertedCount || 0;
    const updated = result.modifiedCount || 0;
    const matched = result.matchedCount || 0;

    logger.info(
      `Página ${page}: insertados ${inserted}, actualizados ${updated}, existentes ${matched}`
    );
    return { inserted, updated, matched, total: ops.length };
  } catch (error) {
    if (error.code === 11000) {
      logger.warn("Algunos empleos ya existían (duplicados ignorados)");
      return { inserted: 0, updated: 0, matched: 0, total: ops.length };
    } else {
      logger.error(`Error insertando en MongoDB: ${error.message}`);
      throw error;
    }
  }
}
