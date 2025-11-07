import { ApolloServer } from "apollo-server";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { connectDB } from "./config/mongooseConfig.js";

// conectamos a mongo, obtenemos datos de Arbeitnow crea servidor Graphql con apollo (typeDefs y resolvers) y arranca el localhost
export async function startServer() {
  await connectDB();

  const server = new ApolloServer({ typeDefs, resolvers });
  const { url } = await server.listen({ port: process.env.PORT || 4000 });
  console.log(`🚀 TalentScope GraphQL API running at ${url}`);
}
