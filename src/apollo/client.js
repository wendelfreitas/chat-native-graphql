import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = new HttpLink({
  uri: "https://api.graph.cool/simple/v1/cjlpbingb0vyj0136jb0ck9fh"
});

const wsLink = new WebSocketLink({
  uri: "wss://subscriptions.us-west-2.graph.cool/v1/cjlpbingb0vyj0136jb0ck9fh",
  options: { reconnect: true }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

export default client;
