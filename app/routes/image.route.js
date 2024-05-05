const { authJwt } = require("../middlewares");
const imageController = require("../controllers/image.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/user/post/image",
    [authJwt.verifyToken],
    imageController.uploadImageServer
  );
  app.post(
    "/api/user/post/image/non-auth",
    imageController.uploadImageServerNonAuth
  );

  app.get("/api/user/post/image/:id", imageController.getImage);

  app.delete(
    "/api/user/post/image/delete",
    [authJwt.verifyToken],
    imageController.deleteImage
  );
};
