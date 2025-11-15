import { ApolloServer } from "apollo-server";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import { connectDB } from "./config/mongooseConfig.js";

// conectamos a mongo, obtenemos datos de Arbeitnow crea servidor Graphql con apollo (typeDefs y resolvers) y arranca el localhost
export async function startServer() {
  try {
    await connectDB();
  } catch (error) {
    console.log(error, "error connection on DB");
  }

  const server = new ApolloServer({ typeDefs, resolvers });
  try {
    const { url } = await server.listen({ port: process.env.PORT || 4000 });
    console.log(`🚀 TalentScope GraphQL API running at ${url}`);
  } catch (error) {
    console.log(error, "error listening the server");
  }
}
