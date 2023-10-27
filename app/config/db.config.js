require("dotenv").config();
module.exports = {
  URL: `${process.env.MONGODB_URI}`,
};
