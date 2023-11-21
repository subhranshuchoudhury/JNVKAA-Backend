const { authJwt } = require("../middlewares");
const controller = require("../controllers/post.controller");
const imageController = require("../controllers/image.controller");
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
    "/api/user/post/image",
    [authJwt.verifyToken],
    imageController.uploadImageServer
  );

  app.get("/api/user/post/image/:id", imageController.getImage);
  app.post(
    "/api/user/post/create",
    [authJwt.verifyToken],
    controller.createPostAlumni
  );

  app.get("/api/post/latest", [authJwt.verifyToken], controller.getLatestPosts);

  app.get(
    "/api/post/search/query",
    [authJwt.verifyToken],
    controller.getPostSearch
  );

  app.get("/api/post/:id", [authJwt.verifyToken], controller.getPostById);

  app.delete(
    "/api/user/post/delete",
    [authJwt.verifyToken],
    controller.deletePost
  );

  app.delete(
    "/api/moderator/post/delete",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.deletePostByModerator
  );

  app.post(
    "/api/moderator/carousal/create",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.postCarousal
  );

  app.get("/api/carousal/latest", controller.getCarousal);

  app.delete(
    "/api/moderator/carousal/delete",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.deleteCarousal
  );
};
