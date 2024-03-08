const { validateUser, authJwt } = require("../middlewares");
const controller = require("../controllers/teacher-profile.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    // * define routes here.

    app.get("/api/teacher/my-profile", [authJwt.verifyToken, authJwt.isTeacher], controller.getMyProfile);
    app.post("/api/teacher/update-profile", [authJwt.verifyToken, authJwt.isTeacher], controller.updateProfileTeacher);
    app.get("/api/teacher/all-profiles", [authJwt.verifyToken, authJwt.haveTeacherRole], controller.getTeachers);

}