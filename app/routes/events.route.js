// const { validateUser, authJwt } = require("../middlewares");
const controller = require("../controllers/events.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/moderator/event/create",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.createEvent
  );

  app.get("/api/top-event-3", controller.getTopEvents);

  app.delete(
    "/api/moderator/event/delete",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.deleteEventById
  );
};
