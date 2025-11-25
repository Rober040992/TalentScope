import { startServer } from "./app.js";
import { startIngestion } from "./childProcess.js";

startServer();
startIngestion(); //usaremos esto para evitar pagar un worker o un cron en render.com