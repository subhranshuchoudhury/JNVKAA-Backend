const mongoose = require("mongoose");

const OfficialPost = mongoose.model(
  "OfficialPost",
  new mongoose.Schema(
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      imageLink: { type: String, default: null },
      externalLink: { type: String, required: false },

      date: { type: Date, default: Date.now },
      views: {
        type: Number,
        default: 1,
      },

      author: {
        id: { type: String, required: true },
      },
    },
    {
      timestamps: true,
    }
  )
);

module.exports = OfficialPost;
