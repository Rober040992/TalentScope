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

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    csrfPrevention: false
  });
  try {
    const port = process.env.PORT || 4565;

    server
      .listen({ port })
      .then(({ url }) => {
        logger.info(`👌 TalentScope GraphQL API running at ${url}`);
      })
      .catch(async (error) => {
        if (error.code === "EADDRINUSE") {
          const fallback = port + 1;
          logger.warn(`⚠️ Puerto ${port} en uso. Probando ${fallback}...`);
          
          const { url } = await server.listen({ port: fallback });
          logger.info(`👌 API arrancada en puerto alternativo: ${url}`);
        
        } else {
          logger.error(`Error starting server: ${error.message}`);
        }
      });

  } catch (error) {
    logger.error(`Error starting server: ${error.message}`);
  }
}
