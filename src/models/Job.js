import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  company_name: String,
  location: String,
  url: String,
  tags: [String],
  created_at: Date,
});

// indice único por url , Dedupicado por url
jobSchema.index({ url: 1 }, { unique: true });

export const Job = mongoose.model("Job", jobSchema);
