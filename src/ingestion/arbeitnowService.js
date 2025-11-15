import fetch from "node-fetch";
import { Job } from "../models/Job.js";
import dotenv from "dotenv";
import { logger } from "../logger/logger.js";

dotenv.config();

export async function fetchAndStoreJobs() {
  try {
     logger.info("Obteniendo datos desde Arbeitnow...");

    // 1. Bloque de FETCH
    let data;
    try {
      const response = await fetch(process.env.API_URL);
      if (!response.ok) {
        throw new Error(`Respuesta HTTP no válida: ${response.status}`);
      }

      data = await response.json();

      if (!data?.data || !Array.isArray(data.data)) {
        throw new Error("La respuesta de la API no contiene el array 'data'");
      }
    } catch (error) {
      logger.error(`Error obteniendo datos de Arbeitnow: ${error.message}`);
      return { success: false, error: `Fetch error: ${error.message}` };
    }

    // 2. Mapeo de datos
    const jobs = data.data.map((job) => ({
      title: job.title,
      company_name: job.company_name,
      location: job.location,
      url: job.url,
      tags: job.tags,
      created_at: new Date(job.created_at),
    }));

    // 3. Bloque de UPSERT (deduplicación + actualización)
    const ops = jobs.map((j) => ({
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
      logger.info(`Procesadas (upsert) ${ops.length} ofertas`);
      return { success: true, jobs: ops.length };
    } catch (error) {
      if (error.code === 11000) {
        logger.warn("Algunos empleos ya existían (duplicados ignorados)");
      } else {
        logger.error(`Error insertando en MongoDB: ${error.message}`);
        return { success: false, error: `MongoDB error: ${error.message}` };
      }
    }
  } catch (error) {
    // 4. Catch global para errores inesperados
    logger.error(`Error inesperado en fetchAndStoreJobs: ${error.message}`);
    return { success: false, error: `Unexpected error: ${error.message}` };
  }
}
