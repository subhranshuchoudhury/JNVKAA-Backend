const mongoose = require("mongoose");

const Teacher = mongoose.model(
    "Teacher",
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
            address: { type: String, default: null },
            whatsappNo: { type: String, default: null },
            joiningYear: { type: String, default: null },
            leavingYear: { type: String, default: null },
            subject: { type: String, default: null },
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

module.exports = Teacher;
