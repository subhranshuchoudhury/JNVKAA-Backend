const { validateUser, authJwt } = require("../middlewares");
const controller = require("../controllers/alumni-auth.controller");

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
    "/api/user/auth/register",
    [validateUser.validateRegister, validateUser.checkDuplicateMobile],
    controller.userRegister
  );

  app.post(
    "/api/user/auth/register-moderator",
    [validateUser.checkDuplicateMobile],
    [authJwt.verifyToken, authJwt.isModerator],
    controller.userRegisterByModerator
  );

  app.post(
    "/api/user/auth/send-otp",
    [validateUser.validateSendOTP],
    controller.sendOTPUser
  );

  app.post(
    "/api/user/auth/verify-otp",
    [validateUser.validateNumOTP],
    controller.verifyUser
  );

  app.post(
    "/api/user/auth/login",
    [validateUser.validateLogin],
    controller.userLogin
  );

  app.post(
    "/api/user/auth/forget-password",
    [validateUser.validateForgetPassword],
    controller.forgetPasswordUser
  );

  app.post(
    "/api/user/auth/change-password",
    [authJwt.verifyToken],
    [validateUser.changePassword],
    controller.changePasswordUser
  );
};
