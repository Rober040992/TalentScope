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

    await Job.insertMany(jobs, { ordered: false }).catch(() => {});
    console.log(`✅ ${jobs.length} empleos guardados/actualizados`);

  } catch (error) {
        console.log(`ERROR obteniendo datos de los empleos`, error);
  }
}
