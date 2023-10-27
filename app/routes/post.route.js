const { authJwt } = require("../middlewares");
const controller = require("../controllers/post.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // * define routes here.
  app.post(
    "/api/user/post/create",
    [authJwt.verifyToken],
    controller.createPostAlumni
  );

  app.get("/api/post/latest", [authJwt.verifyToken], controller.getLatestPosts);

  app.post(
    "/api/moderator/carousal/create",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.postCarousal
  );

  app.get("/api/carousal/latest", controller.getCarousal);
};
