const mongoose = require("mongoose");

const Alumni = mongoose.model(
  "Alumni",
  new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    premiumExpiry: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    profileDetails: {
      isProfileCompleted: { type: Boolean, default: false },
      profileImage: { type: String, default: null },
      graduationYear: { type: String, default: null }, // batch
      address: { type: String, default: null },
      location: { type: String, default: null },
      bloodGroup: { type: String, default: null },
      dob: { type: String, default: null },
      schoolNo: { type: String, default: null },
      whatsappNo: { type: String, default: null },
      mailId: { type: String, default: null },
      profession: { type: String, default: null },
      instagram: { type: String, default: null },
      facebook: { type: String, default: null },
      linkedIn: { type: String, default: null },
      address: { type: String, default: null },
      about: { type: String, default: null },
    },

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
