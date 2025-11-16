import { ApolloServer } from "apollo-server";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { connectDB, logger } from "@talentscope/shared";

// conectamos a mongo, obtenemos datos de Arbeitnow crea servidor Graphql con apollo (typeDefs y resolvers) y arranca el localhost
export async function startServer() {
  try {
    await connectDB();
  } catch (error) {
    logger.error(`Error connecting to DB: ${error.message}`);
  }

  const server = new ApolloServer({ typeDefs, resolvers });
  try {
    const { url } = await server.listen({ port: process.env.PORT || 4000 });
    logger.info(`👌 TalentScope GraphQL API running at ${url}`);
  } catch (error) {
    logger.error(`Error starting server: ${error.message}`);
  }
}
