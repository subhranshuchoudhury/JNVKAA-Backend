// const { validateUser, authJwt } = require("../middlewares");
const controller = require("../controllers/support.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/api/user/support", controller.sendSupportMail);


};
