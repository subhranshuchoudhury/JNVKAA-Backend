const { validateUser, authJwt } = require("../middlewares");
const controller = require("../controllers/alumni-profile.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/alumni/update-details",
    [authJwt.verifyToken],
    controller.updateProfile
  );

  app.post(
    "/api/alumni/search/id",
    [authJwt.verifyToken],
    controller.alumnusSearchById
  );
};
