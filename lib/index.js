"use strict";

var _graphqlYoga = require("graphql-yoga");

let chattingLog = [{
  id: 0,
  writer: "admin",
  description: "HELLO"
}];
const typeDefs = "\ntype Chat {\n  id: Int!\n  writer: String!\n  description: String!\n}\ntype Query {\n  chatting: [Chat]!\n}\n";
const resolvers = {
  Query: {
    chatting: () => {
      return chattingLog;
    }
  }
};
const server = new _graphqlYoga.GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers
});
server.start(() => console.log("Graphql Server Running"));