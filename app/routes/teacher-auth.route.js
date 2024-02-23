const { validateUser, authJwt } = require("../middlewares");
const controller = require("../controllers/teacher-auth.controller");

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
        "/api/teacher/auth/register/",
        [validateUser.validateRegisterTeacher, validateUser.checkDuplicateMobileTeacher],
        controller.teacherRegister
    );
    app.post("/api/teacher/auth/login/", validateUser.validateLogin, controller.teacherLogin);
    app.post("/api/teacher/auth/verify/", [authJwt.verifyToken, authJwt.isModerator], controller.verifyTeacherByModerator);
    app.get("/api/teacher/auth/pendingverification/", [authJwt.verifyToken, authJwt.isModerator], controller.showPendingVerificationTeachers);
};
