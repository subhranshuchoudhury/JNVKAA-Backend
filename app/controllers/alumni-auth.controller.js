const config = require("../config/auth.config");
const db = require("../models");
const Alumni = db.alumni;
const Role = db.role;
const otpGenerator = require("otp-generator");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
process.env.TZ = "Asia/Kolkata";

const sendSMS = async (mobile, otp) => {
  try {
    const headersList = {
      "Cache-Control": "no-cache",
    };

    const endPoint = `https://www.fast2sms.com/dev/bulkV2?authorization=${
      process.env.FAST_2_SMS_API_KEY
    }&variables_values=${otp}&route=otp&numbers=${Number(mobile)}`;

    // ! TESTING:
    console.log("OTP: ", mobile, otp);
    // return 200;

    if (process.env.PROD == "false") {
      return 200;
    }

    const response = await fetch(endPoint, {
      method: "GET",
      headers: headersList,
    });

    const data = await response.json();

    console.log(data);

    if (data.return === false) {
      return 400;
    } else {
      return 200;
    }
  } catch (error) {
    console.log(error);
    return 400;
  }
};

exports.userRegister = async (req, res) => {
  const alumni = new Alumni({
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 8),
    mobile: req.body.mobile,
    verified: false,
    tempOTP: {
      otp: null,
      createdAt: null,
    },
  });

  try {
    const roles = await Role.find({
      name: { $in: "alumni" }, // ! Caution : "alumni" should not be changed.
    });
    alumni.roles = roles.map((role) => role._id);
    await alumni.save();
    return res.status(200).send({ message: "Alumni registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
    return;
  }
};

exports.userRegisterByModerator = async (req, res) => {
  const alumni = new Alumni({
    name: req.body.name,
    password: bcrypt.hashSync(req.body.password, 8),
    mobile: req.body.mobile,
    verified: true,
    tempOTP: {
      otp: null,
      createdAt: null,
    },
  });

  try {
    const roles = await Role.find({
      name: { $in: "alumni" }, // ! Caution : "alumni" should not be changed.
    });
    alumni.roles = roles.map((role) => role._id);
    await alumni.save();
    return res.status(200).send({ message: "Alumni registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
    return;
  }
};

exports.userLogin = async (req, res) => {
  try {
    const alumni = await Alumni.findOne({
      mobile: req.body.mobile,
    }).populate("roles", "-__v");

    if (alumni) {
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        alumni.password
      );

      if (!alumni.verified) {
        return res.status(301).send({
          accessToken: null,
          message: "Account not verified",
        });
      }

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Incorrect Password",
        });
      }

      const token = jwt.sign({ id: alumni.id }, config.secret, {
        expiresIn: 94608000, // 3 Years
      });

      var authorities = [];

      for (let i = 0; i < alumni.roles.length; i++) {
        authorities.push("ROLE_" + alumni.roles[i].name.toUpperCase());
      }
      res.setHeader("Set-Cookie", `x-access-token=${token}`);
      res.status(200).send({
        name: alumni.name,
        mobile: alumni.mobile,
        roles: authorities,
        accessToken: token,
        isProfileCompleted: alumni.profileDetails.isProfileCompleted,
      });
    } else {
      return res.status(404).send({ message: "Alumni not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
    return;
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const alumni = await Alumni.findOne({
      mobile: req.body.mobile,
    });

    if (!alumni) {
      return res.status(404).send({ message: "Alumni not found" });
    }

    if (alumni.verified) {
      return res.status(400).send({ message: "Alumni already verified" });
    }

    if (!alumni.tempOTP.otp) {
      return res.status(400).send({ message: "Kindly resend OTP." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.otp,
      alumni.tempOTP.otp
    );

    if (!passwordIsValid) {
      // alumni.tempOTP.otp = null;
      // await alumni.save();
      return res.status(401).send({ message: "Wrong OTP" });
    }

    const timeDiff = Math.abs(
      new Date().getTime() - alumni.tempOTP.createdAt.getTime()
    );
    const diffMinutes = Math.ceil(timeDiff / (1000 * 60));
    if (diffMinutes > 5) {
      return res.status(400).send({
        message: "OTP expired. Please resend OTP again",
      });
    }

    alumni.verified = true;
    alumni.tempOTP.otp = null;
    await alumni.save();

    const token = jwt.sign({ id: alumni.id }, config.secret, {
      expiresIn: 94608000, // 3 years
    });
    return res.status(200).send({
      message: "Alumni verified successfully",
      name: alumni.name,
      mobile: alumni.mobile,
      roles: ["ROLE_USER"],
      accessToken: token,
      isProfileCompleted: alumni.profileDetails.isProfileCompleted,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
    return;
  }
};

exports.sendOTPUser = async (req, res) => {
  try {
    const alumni = await Alumni.findOne({
      mobile: req.body.mobile,
    }).select("tempOTP");

    if (!alumni) {
      return res.status(404).send({ message: "Alumni not found" });
    }

    if (alumni.tempOTP.otp) {
      const timeDiff = Math.abs(
        new Date().getTime() - alumni.tempOTP.createdAt.getTime()
      );
      const diffMinutes = Math.ceil(timeDiff / (1000 * 60));
      if (diffMinutes < 5) {
        res.status(400).send({
          message: `SMS already sent. Please try again after ${
            5 - diffMinutes
          } minute(s)`,
          diffMinutes: 5 - diffMinutes,
        });
        return;
      }
    }

    const OTP = otpGenerator.generate(8, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    // const OTP = "99999999";

    alumni.tempOTP.otp = bcrypt.hashSync(OTP, 8);
    alumni.tempOTP.createdAt = new Date();

    const smsResp = await sendSMS(req.body.mobile, OTP);

    if (smsResp === 400) {
      res.status(500).send({ message: "Error sending OTP" });
      return;
    } else {
      await alumni.save();
      res.status(200).send({
        message: "SMS sent successfully. Please check your inbox",
      });
    }
  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }
};

exports.forgetPasswordUser = async (req, res) => {
  console.log(req.body);
  try {
    const alumni = await Alumni.findOne({ mobile: req.body.mobile }).select(
      "tempOTP password "
    );
    if (!alumni) {
      res.status(404).send({ message: "Alumni not found" });
      return;
    }

    if (!alumni.tempOTP.otp) {
      res.status(400).send({ message: "Please send OTP first" });
      return;
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.otp,
      alumni.tempOTP.otp
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid OTP" });
    }

    const timeDiff = Math.abs(
      new Date().getTime() - alumni.tempOTP.createdAt.getTime()
    );
    const diffMinutes = Math.ceil(timeDiff / (1000 * 60));
    if (diffMinutes > 5) {
      return res.status(400).send({
        message: "OTP expired. Please resend OTP again",
      });
    }

    alumni.tempOTP.otp = null;
    alumni.tempOTP.createdAt = null;
    alumni.password = bcrypt.hashSync(req.body.password, 8);
    await alumni.save();

    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server failure" });
    return;
  }
};

exports.changePasswordUser = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.userId).select("password");
    if (!alumni) {
      res.status(404).send({ message: "Alumni not found" });
      return;
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.oldPassword,
      alumni.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid old password" });
    }

    alumni.password = bcrypt.hashSync(req.body.newPassword, 8);
    await alumni.save();

    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error });
    return;
  }
};
