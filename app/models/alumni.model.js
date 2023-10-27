const mongoose = require("mongoose");

const Alumni = mongoose.model(
  "Alumni",
  new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    password: { type: String, required: true },
    graduationYear: { type: String, default: null },
    branch: { type: String, default: null },
    major: { type: String, default: null },
    jobHistory: [
      {
        jobTitle: { type: String, default: null },
        companyName: { type: String, default: null },
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
        location: { type: String, default: null },
        description: { type: String, default: null },
      },
    ],
    address: { type: String, default: null },
    skills: { type: String, default: null },
    achievements: { type: String, default: null },
    location: { type: String, default: null },
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
