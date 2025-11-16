import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  company_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  location: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// indice único por url , Dedupicado por url
jobSchema.index({ url: 1 }, { unique: true });

// indice compuesto
jobSchema.index({ title: 1, company_name: 1, location: 1 }, { unique: true });

export const Job = mongoose.model("Job", jobSchema);
