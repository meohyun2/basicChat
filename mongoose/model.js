import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    writer: { type: String, required: true },
    description: { type: String, required: true },
    roomName: { type: String, required: true }
  });

export default mongoose.model("log",blogSchema);