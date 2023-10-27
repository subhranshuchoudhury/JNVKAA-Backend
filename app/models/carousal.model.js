const mongoose = require("mongoose");

const Carousal = mongoose.model(
  "Carousal",
  new mongoose.Schema({
    title: { type: String, required: true },
    image: {
      data: { type: String, required: true },
      contentType: { type: String, required: true },
    },
    date: { type: Date, default: Date.now },
    author: { type: String, default: "Moderator" },
    timestamp: { type: Date, default: Date.now },
  })
);

module.exports = Carousal;
