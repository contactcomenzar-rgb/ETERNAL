const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
  content: String,
  date: String,
  author: String,
  image: String,
  link: String,
  image: String,
  imagePublicId: String
  
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);