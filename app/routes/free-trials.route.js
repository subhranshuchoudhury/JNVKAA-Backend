// const { validateUser, authJwt } = require("../middlewares");
const controller = require("../controllers/free-trial.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/moderator/free-trial/create",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.create
  );

  app.get(
    "/api/user/free-trial/redeem/:code",
    [authJwt.verifyToken],
    controller.redeem
  );

  app.get("/api/user/free-trials", [authJwt.verifyToken], controller.getTrials);

  app.delete(
    "/api/user/free-trial/deactivate/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.deactivateFreeTrial
  );
};
