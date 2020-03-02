import {GraphQLServer, PubSub} from "graphql-yoga";
import Blog from '../mongoose/model';
import connect from '../mongoose';

connect();

//pubsub을 통해서 data stream 구현
const pubsub = new PubSub();
const NEW_CHAT = "NEW_CHAT";


let chattingLog = [{
  _id: "id",
  writer: "admin",
  description: "HELLO",
  roomName:"RoomA"
}];

const typeDefs = `
  type Chat {
    _id: String!
    writer: String!
    description: String!
    roomName: String
  }
  type Query {
    chatting(roomName:String): [Chat]!
  }
  type Mutation {
    write(writer: String!, description: String!, roomName: String!): String!
  }
  type Subscription {
    newChat: Chat
  }
`;

const resolvers = {
  Query: {
    chatting: async (_, { roomName }, { Blog }) => {
      const chattingLog = [];
      await Blog.find({ roomName }).then(result => {
        result.forEach(i => {
          chattingLog.push(i);
        });
      });
      return chattingLog;
    }
  },
  Mutation: {
    write: async (_, { writer, description, roomName }, { pubsub, Blog }) => {
      const newChat = {
        writer,
        description,
        roomName
      };
      await Blog.create(newChat, (err, blog) => {
        newChat._id = blog._id; //newChat 객체에 DB _id 추가
        pubsub.publish(roomName, {
          newChat
        });
      });
      return "YES";
    }
  },
  Subscription: {
    newChat: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator(["RoomA", "RoomB"]);
      }
    }
  }
};

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  context: {pubsub,Blog}
});

server.start(() => console.log("Graphql Server Running"));