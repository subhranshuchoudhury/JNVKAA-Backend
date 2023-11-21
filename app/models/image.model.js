const mongoose = require("mongoose");

const Image = mongoose.model(
  "Image",
  new mongoose.Schema({
    image: {
      data: Buffer,
      contentType: String,
      uploader: String,
    },
  })
);

module.exports = Image;
