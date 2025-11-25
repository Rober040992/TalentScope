import { spawn } from "child_process";

//usaremos esto para evitar pagar un worker o un cron en render.com
// el micro servicio de ingesta esta listo para ser desplegado en un worker, en ese caso de despliegue eliminar este file.
export function startIngestion() {
  const ingestion = spawn("npm", ["--workspace", "apps/ingestion", "start"], {
    stdio: "inherit",
    shell: true
  });

  ingestion.on("exit", (code) => {
    console.log("Ingestion finished with code:", code);
  });
}
