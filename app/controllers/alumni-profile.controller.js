const config = require("../config/auth.config");
const db = require("../models");
const Alumni = db.alumni;
const Role = db.role;
const otpGenerator = require("otp-generator");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
process.env.TZ = "Asia/Kolkata";

exports.updateProfile = async (req, res) => {
  const updateData = req.body; // Assuming the request body contains the updated profileDetails
  const alumniId = req.userId;
  try {
    const updatedAlumni = await Alumni.findByIdAndUpdate(
      alumniId,
      { $set: { profileDetails: updateData } },
      { new: true }
    ).select("profileDetails");

    if (!updatedAlumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    const allDetailsFilled = Object.values(updatedAlumni.profileDetails).every(
      (value) => value !== null
    );

    updatedAlumni.profileDetails.isProfileCompleted = allDetailsFilled;

    await updatedAlumni.save();

    return res.json({
      message: "Profile Details updated successfully",
      alumni: updatedAlumni,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateProfileAdmin = async (req, res) => {
  const alumniId = req.body.alumniId;
  const updateData = req.body; // Assuming the request body contains the updated profileDetails

  try {
    const updatedAlumni = await Alumni.findByIdAndUpdate(
      alumniId,
      { $set: { profileDetails: updateData } },
      { new: true }
    );

    if (!updatedAlumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    return res.json({
      message: "ProfileDetails updated successfully",
      alumni: updatedAlumni,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.alumnusSearchById = async (req, res) => {
  const alumniId = req.body.id;
  const reqUser = req.userId;
  try {
    const user = await Alumni.findById(reqUser).select("premiumExpiry");
    const alumni = await Alumni.findById(alumniId).select(
      "name mobile profileDetails"
    );

    if (user?.premiumExpiry >= Date()) {
      return res.status(200).send({ alumni, isBlur: false });
    } else {
      alumni.profileDetails = null;
      alumni.mobile = null;
      return res.status(200).send({ alumni, isBlur: true });
    }
  } catch (error) {
    return res.status(500).send({ message: "Server failure" });
  }
};
