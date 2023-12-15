const { validateUser, authJwt } = require("../middlewares");
const controller = require("../controllers/newsupdate.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/moderator/newsupdate/create",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.create
  );

  app.get("/api/newsupdate", controller.getNewsUpdates);

  app.delete(
    "/api/moderator/newsupdate/delete",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.deleteNewsUpdate
  );
};
