import fetch from "node-fetch";
import { Job } from "../models/Job.js";
import dotenv from "dotenv";

dotenv.config();

export async function fetchAndStoreJobs() {
  try {
    const response = await fetch(process.env.API_URL);
    const data = await response.json();

    const jobs = data.data.map((job) => ({
      title: job.title,
      company_name: job.company_name,
      location: job.location,
      url: job.url,
      tags: job.tags,
      created_at: new Date(job.created_at),
    }));

    // deduplicacion y actualizacion
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

    await Job.bulkWrite(ops, { ordered: false });
    console.log(`✅ Procesadas (upsert) ${ops.length} ofertas`);
  } catch (error) {
    console.error("❌ Error durante la ingesta:", error);
  }
}
