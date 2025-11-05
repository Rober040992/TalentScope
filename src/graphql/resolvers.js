import { Job } from "../models/Job.js";

// define la lógica de cada query
export const resolvers = {
  Query: {
    jobs: async () => await Job.find().sort({ created_at: -1 }).limit(50),
  },
};
