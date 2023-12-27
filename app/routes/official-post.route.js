const { authJwt } = require("../middlewares");
const controller = require("../controllers/official-post.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Official Post Route

  app.post(
    "/api/moderator/official/post/create",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.createOfficialPost
  );

  app.get(
    "/api/user/official/post",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.getOfficialPosts
  );

  app.get("/api/user/official/post/:id", controller.getOfficialPostByID);

  app.delete(
    "/api/moderator/official/post/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.deleteOfficialPost
  );

  // Official Post Route End
};
