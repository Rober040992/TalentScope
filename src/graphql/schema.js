import { gql } from "apollo-server";

export const typeDefs = gql`
  type Job {
    id: ID!
    title: String
    company_name: String
    location: String
    url: String
    tags: [String]
    created_at: String
  }

  type Query {
    jobs: [Job]
  }
`;
