// mapArbeitnowJobs.js
// -------------------------------------------------------------
// Esta función recibe el array tal cual llega de la API externa
// y lo normaliza al formato exacto que usa nuestro modelo Job.
// -------------------------------------------------------------

export function mapArbeitnowJobs(apiJobs) {
  return apiJobs.map((job) => ({
    title: job.title,
    company_name: job.company_name,
    location: job.location,
    url: job.url,
    tags: job.tags,
    created_at: new Date(job.created_at),
  }));
}
