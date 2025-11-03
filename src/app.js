import { ApolloServer } from "apollo-server";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { connectDB } from "./config/mongooseConfig.js";
import { fetchAndStoreJobs } from "./services/arbeitnowService.js";

export async function startServer() {
  await connectDB();
  await fetchAndStoreJobs();

  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen({ port: process.env.PORT || 4000 });
  console.log(`🚀 TalentScope GraphQL API running at ${url}`);
}
