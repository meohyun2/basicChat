import mongoose from "mongoose";
import Blog from "./model";
const uri ="mongodb+srv://id:pwd@chatserver-aef0b.mongodb.net/test?retryWrites=true&w=majority";
module.exports = () => {
  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
  if (err) console.error(err);
  });
  Blog;
};
