// * Imports

const validateModerator = require("./validateModerator");
const validateUser = require("./validateUser");
const authJwt = require("./authJwt");
// * Exports

module.exports = {
  validateModerator,
  validateUser,
  authJwt,
};
