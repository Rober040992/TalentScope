import { Job, logger } from "@talentscope/shared";

// define la lógica de cada query
export const resolvers = {
  Query: {
    jobs: async (_parent, { page = 1, limit = 10 }) => {
      logger.info(`📥 Query jobs ejecutada: página ${page}, ofertas mostradas ${limit}`);
      const p = Math.max(1, Number(page) || 1)
      const l = Math.min(100, Math.max(1, Number(limit) || 10))
      const skip = (p - 1) * l

      const [results, total] = await Promise.all([
        Job.find().sort({ created_at: -1 }).skip(skip).limit(l),
        Job.countDocuments()
      ])

      return {
        total,
        results,
        page: p,
        limit: l,
        hasPrevPage: p > 1,
        hasNextPage: skip + results.length < total
      }
    }
  }
}

export default resolvers