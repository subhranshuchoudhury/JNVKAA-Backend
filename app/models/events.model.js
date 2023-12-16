const mongoose = require("mongoose");

const Events = mongoose.model(
  "Events",
  new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  })
);

module.exports = Events;
