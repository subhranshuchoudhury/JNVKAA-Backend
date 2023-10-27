const mongoose = require("mongoose");

const Moderator = mongoose.model(
  "Moderator",
  new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
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

module.exports = Moderator;
