const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.moderator = require("./moderator.model");
db.alumni = require("./alumni.model");
db.role = require("./role.model");
db.post = require("./post.model");
db.carousal = require("./carousal.model");
db.image = require("./image.model");
db.youtubePost = require("./youtube-videos.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
