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
    [authJwt.verifyToken, authJwt.haveTeacherRole],
    controller.alumnusSearchById
  );

  app.get(
    "/api/alumni/search",
    [authJwt.verifyToken, authJwt.haveTeacherRole],
    controller.getAlumniSearch
  );

  app.get("/api/alumni/all", [authJwt.verifyToken, authJwt.haveTeacherRole], controller.getAlumnus);

  app.get("/api/alumni/profile/last-4", controller.getAlumniProfileLastFour);
  app.get(
    "/api/alumni/my-profile",
    [authJwt.verifyToken],
    controller.getMyProfile
  );

  app.get("/api/alumni/birthdays", controller.getBirthdays);
  // app.post(
  //   "/api/alumni/update-my-profile",
  //   [authJwt.verifyToken],
  //   controller.updateMyProfile
  // );
};
