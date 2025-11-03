// src/scripts/updateJobs.js
import { connectDB } from "../config/mongooseConfig.js";
import { fetchAndStoreJobs } from "../services/arbeitnowService.js";

// Ejecuta el script standalone para actualizar los empleos
const run = async () => {
  await connectDB();
  await fetchAndStoreJobs();
  process.exit(0);
};

run();
