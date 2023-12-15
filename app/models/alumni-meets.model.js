const mongoose = require("mongoose");

const AlumniMeets = mongoose.model(
  "AlumniMeets",
  new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  })
);

module.exports = AlumniMeets;
