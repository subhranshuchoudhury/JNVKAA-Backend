const mongoose = require("mongoose");

const YoutubePosts = mongoose.model(
  "YoutubePosts",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  })
);

module.exports = YoutubePosts;
