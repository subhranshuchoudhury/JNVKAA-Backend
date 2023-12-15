const mongoose = require("mongoose");

const NewsUpdate = mongoose.model(
  "NewsUpdate",
  new mongoose.Schema({
    title: { type: String, required: true },
    link: "String",
    date: { type: Date, default: Date.now },
  })
);

module.exports = NewsUpdate;
