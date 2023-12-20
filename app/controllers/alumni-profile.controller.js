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

    updatedAlumni.profileDetails.isProfileCompleted = true;

    const keysToExclude = [
      "instagram",
      "linkedIn",
      "isProfileCompleted",
      "profileImage",
      "premiumExpiry",
      "location",
      "facebook",
    ];

    for (const key in updatedAlumni.profileDetails) {
      if (updatedAlumni.profileDetails.hasOwnProperty(key)) {
        if (keysToExclude.includes(key)) {
          continue; // Skip checking for specified keys
        }

        const value = updatedAlumni.profileDetails[key];
        if (value === "" || value === undefined || value === null) {
          updatedAlumni.profileDetails.isProfileCompleted = false;
          break;
        }
      }
    }

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

    const isPremiumUser =
      user?.premiumExpiry && user?.premiumExpiry >= new Date();

    const alumni = await Alumni.findById(alumniId).select(
      isPremiumUser
        ? "-password -tempOTP -roles"
        : "name profileDetails.graduationYear profileDetails.profileImage profileDetails.schoolNo profileDetails.about"
    );

    if (!alumni) {
      return res.status(404).send({});
    } else {
      return res.status(200).send(alumni);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.getAlumniSearch = async (req, res) => {
  const reqUser = req.userId;
  try {
    const reqUserDetails = await Alumni.findById(reqUser).select(
      "premiumExpiry"
    );

    const isNotPremiumUser =
      !reqUserDetails?.premiumExpiry ||
      reqUserDetails?.premiumExpiry < new Date();

    const alumniHiddenData = await Alumni.find({
      $or: [
        { name: { $regex: `${req.query?.name}`, $options: "i" } }, // * i : non-case sensitive
        {
          mobile: { $regex: `^${req.query?.mobile}`, $options: "i" },
        },
        {
          "profileDetails.graduationYear": {
            $regex: `^${req.query?.graduationyear}`,
            $options: "i",
          },
        },
        {
          "profileDetails.bloodGroup": {
            $regex: `^${req.query?.bloodgroup}`,
            $options: "i",
          },
        },
        {
          "profileDetails.schoolNo": {
            $regex: `^${req.query?.schoolno}`,
            $options: "i",
          },
        },

        {
          "profileDetails.whatsAppNo": {
            $regex: `^${req.query?.whatsappno}`,
            $options: "i",
          },
        },
        {
          "profileDetails.mailId": {
            $regex: `^${req.query?.mailid}`,
            $options: "i",
          },
        },
        {
          "profileDetails.profession": {
            $regex: `^${req.query?.profession}`,
            $options: "i",
          },
        },
        {
          "profileDetails.address": {
            $regex: `${req.query?.address}`,
            $options: "i",
          },
        },
        // {
        //   hashtag: {
        //     $elemMatch: {
        //       $regex: `^${req.query?.hashtag}`,
        //       $options: "i",
        //     },
        //   },
        // },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(16)
      .select(
        isNotPremiumUser
          ? "name profileDetails.schoolNo profileDetails.graduationYear profileDetails.profileImage"
          : "-password -tempOTP"
      );
    return res.status(200).send(alumniHiddenData);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.getAlumnus = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 16;

    console.log(skip, limit);

    const reqUserDetails = await Alumni.findById(req.userId).select(
      "premiumExpiry"
    );
    // check if premium expired

    if (
      !reqUserDetails?.premiumExpiry ||
      reqUserDetails?.premiumExpiry < new Date()
    ) {
      const alumni = await Alumni.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "name profileDetails.schoolNo profileDetails.graduationYear profileDetails.profileImage"
        );
      return res.status(200).send(alumni);
    } else {
      const alumni = await Alumni.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-password -tempOTP");
      return res.status(200).send(alumni);
    }
  } catch (error) {
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.getAlumniProfileLastFour = async (req, res) => {
  try {
    const alumni = await Alumni.find()
      .sort({ createdAt: -1 })
      .where("verified")
      .equals(true)
      .limit(4)
      .select(
        "name profileDetails.profileImage profileDetails.schoolNo profileDetails.graduationYear profileDetails.bloodGroup"
      );
    return res.status(200).send(alumni);
  } catch (error) {
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.userId).select("-password");
    return res.status(200).send(alumni);
  } catch (error) {
    return res.status(500).send({ message: "Server failure" });
  }
};
