// const { validateUser, authJwt } = require("../middlewares");
const controller = require("../controllers/alumni-meet.controller");
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
    "/api/moderator/alumni-meet/create",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.createAlumniMeetPost
  );

  app.get("/api/top-alumni-meet-3", controller.getAlumniTopMeets);

  app.get("/api/alumni-meet", controller.getAlumniMeets);

  app.delete(
    "/api/moderator/alumni-meet/delete",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.deleteAlumniMeetById
  );
};
