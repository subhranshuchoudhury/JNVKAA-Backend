const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
      data: { type: String, required: true },
      contentType: { type: String, required: true },
    },
    links: [
      {
        link: { type: String, required: true },
        name: { type: String, required: true },
      },
    ],
    hashtag: [
      {
        type: String,
        required: true,
      },
    ],
    date: { type: Date, default: Date.now },
    views: Number,
    likes: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true },
      },
    ],
    comments: [
      {
        name: { type: String, required: true },
        id: { type: String, required: true },
        comment: { type: String, required: true },
      },
    ],
    author: {
      name: { type: String, required: true },
      id: { type: String, required: true },
    },
    timestamp: { type: Date, default: Date.now },
  })
);

module.exports = Post;
