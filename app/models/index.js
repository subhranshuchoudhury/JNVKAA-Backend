const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.moderator = require("./moderator.model");
db.alumni = require("./alumni.model");
db.role = require("./role.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
