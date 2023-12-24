const mongoose = require("mongoose");

const FreeTrial = mongoose.model(
  "FreeTrial",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      code: { type: String, required: true },
      duration_in_days: { type: Number, default: 15 },
      offerEnd: { type: Date, default: Date.now() + 15 * 24 * 60 * 60 * 1000 },
      isActivated: Boolean,
      redeemed_users: [
        {
          name: String,
          phone: String,
          id: String,
        },
      ],
    },
    {
      timestamps: true,
    }
  )
);

module.exports = FreeTrial;
