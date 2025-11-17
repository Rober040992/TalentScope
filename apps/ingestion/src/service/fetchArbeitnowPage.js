// fetchArbeitnowPage.js
// -------------------------------------------------------------
// Esta función se encarga ÚNICAMENTE de obtener una página
// desde la API de Arbeitnow usando el número de página recibido.
// -------------------------------------------------------------

import fetch from "node-fetch";
import { logger } from "@talentscope/shared";

export async function fetchArbeitnowPage(page) {
  const url = `${process.env.API_URL}?page=${page}`;

  let retries = 3;

  while (retries > 0) {
    const res = await fetch(url);

    if (res.status === 429) {
      logger.warn(`429 en página ${page}. Esperando 2s...`);
      await new Promise(r => setTimeout(r, 2000));
      retries--;
      continue;
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();
    return json.data;
  }

  throw new Error("429 persistente. Abortado.");
}
