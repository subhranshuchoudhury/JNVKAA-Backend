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
db.newsUpdate = require("./newsupdates.model");
db.event = require("./events.model");
db.alumniMeets = require("./alumni-meets.model");
db.freeTrials = require("./free-trial.model");
db.officialPost = require("./official-post.model");
db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
