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

    if (user.premiumExpiry && user?.premiumExpiry >= new Date()) {
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

exports.getAlumniSearch = async (req, res) => {
  const reqUser = req.userId;
  try {
    const reqUserDetails = await Alumni.findById(reqUser).select(
      "premiumExpiry"
    );

    if (
      !reqUserDetails.premiumExpiry ||
      reqUserDetails.premiumExpiry < new Date()
    ) {
      const alumniHiddenData = await Alumni.find({
        $or: [
          { name: { $regex: `^${req.query?.name}`, $options: "i" } }, // * i : non-case sensitive
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
        .sort({ timestamp: -1 })
        .limit(20)
        .select("-password -tempOTP -mobile -profileDetails");
      return res.status(200).send(alumniHiddenData);
    }
    const posts = await Alumni.find({
      $or: [
        { name: { $regex: `^${req.query?.name}`, $options: "i" } }, // * i : non-case sensitive
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
      .sort({ timestamp: -1 })
      .limit(20)
      .select("-password -tempOTP");

    return res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};
