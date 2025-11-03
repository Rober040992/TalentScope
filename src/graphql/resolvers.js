import { Job } from "../models/Job.js";

export const resolvers = {
  Query: {
    jobs: async () => await Job.find().sort({ created_at: -1 }).limit(50),
  },
};
