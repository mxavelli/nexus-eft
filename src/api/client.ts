import { GraphQLClient } from "graphql-request";

export const TARKOV_API_URL = "https://api.tarkov.dev/graphql";

export const tarkovClient = new GraphQLClient(TARKOV_API_URL, {
  headers: { "Content-Type": "application/json" },
});
