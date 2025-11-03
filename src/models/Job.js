import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: String,
  company_name: String,
  location: String,
  url: String,
  tags: [String],
  created_at: Date,
});

export const Job = mongoose.model("Job", jobSchema);
