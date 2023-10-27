const mongoose = require("mongoose");

const Alumni = mongoose.model(
  "Alumni",
  new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    tempOTP: {
      otp: { type: String, default: null },
      createdAt: { type: Date, default: null },
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);

module.exports = Alumni;
