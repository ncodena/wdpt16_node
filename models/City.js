import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  imageBase64: String,
});

const Image = mongoose.model("Image", imageSchema);

export default Image;