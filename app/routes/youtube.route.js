// const { validateUser, authJwt } = require("../middlewares");
const controller = require("../controllers/youtube.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/moderator/post/youtube/id/:id", controller.getYoutubePostById);
};
