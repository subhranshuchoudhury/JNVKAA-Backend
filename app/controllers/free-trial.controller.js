const db = require("../models");
const Alumni = db.alumni;
const FreeTrials = db.freeTrials;

exports.create = async (req, res) => {
  try {
    const freeTrial = new FreeTrials({
      name: req.body.name,
      code: req.body.code,
      isActivated: true,
      duration_in_days: req.body.duration_in_days,
    });

    const result = await freeTrial.save();
    res.send(result);
  } catch (error) {
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Free Trial.",
    });
  }
};

exports.redeem = async (req, res) => {
  try {
    const requestedUser = req.userId;
    const requestedCode = req.params.code;
    const freeTrial = await FreeTrials.findOne({ code: requestedCode });
    if (!freeTrial) {
      return res.status(404).send({ message: "Free Trial Not found." });
    }
    if (!freeTrial.isActivated) {
      return res.status(404).send({ message: "Free Trial is not activated." });
    }

    const isRedeemed = freeTrial.redeemed_users.some(
      (user) => user.id === requestedUser
    );

    if (isRedeemed) {
      return res.status(404).send({ message: "Free Trial already redeemed." });
    }

    const userDetails = await Alumni.findOne({ _id: requestedUser }).select(
      "name mobile premiumExpiry"
    );

    if (!userDetails) {
      return res.status(404).send({ message: "User Not found." });
    }

    if (userDetails.premiumExpiry) {
      // check if premium is expired
      const today = new Date();
      const premiumExpiry = new Date(userDetails.premiumExpiry);
      if (premiumExpiry > today) {
        return res
          .status(404)
          .send({ message: "You already have premium membership." });
      } else {
        const date = new Date();
        date.setDate(date.getDate() + freeTrial.duration_in_days);
        userDetails.premiumExpiry = date;
        await userDetails.save();
      }
    } else {
      const date = new Date();
      date.setDate(date.getDate() + freeTrial.duration_in_days);
      userDetails.premiumExpiry = date;
      await userDetails.save();
    }

    freeTrial.redeemed_users.push({
      name: userDetails.name,
      phone: userDetails.mobile,
      id: req.userId,
    });

    await freeTrial.save();
    return res.status(200).send({ message: "Free Trial redeemed." });
  } catch (error) {
    return res.status(500).send({
      message: "Some error occurred while redeeming.",
    });
  }
};
