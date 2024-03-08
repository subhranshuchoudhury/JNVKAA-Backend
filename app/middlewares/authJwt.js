const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Moderator = db.moderator;
const Teacher = db.teacher;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isModerator = (req, res, next) => {
  Moderator.findById(req.userId)
    .then((user) => {
      if (user) {
        Role.find({ _id: { $in: user.roles } })
          .then((roles) => {
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name === "moderator") {

                next();
                return;
              }
            }

            res.status(403).send({ message: "Require Moderator Role!" });
            return;
          })
          .catch((err) => {
            res.status(500).send({ message: err });
            return;
          });
      } else {
        return res.status(404).send({ message: "No moderator found" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      return;
    });
};

isTeacher = (req, res, next) => {
  Teacher.findById(req.userId)
    .then((user) => {
      if (user) {
        Role.find({ _id: { $in: user.roles } })
          .then((roles) => {
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name === "teacher") {
                req.isTeacher = true;
                next();
                return;
              }
            }

            res.status(403).send({ message: "Require Teacher Role!" });
            return;
          })
          .catch((err) => {
            res.status(500).send({ message: err });
            return;
          });
      } else {
        return res.status(404).send({ message: "No Teacher found" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      return;
    });
};

haveTeacherRole = (req, res, next) => {
  Teacher.findById(req.userId)
    .then((user) => {
      if (user) {
        Role.find({ _id: { $in: user.roles } })
          .then((roles) => {
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name === "teacher") {
                req.isTeacher = true;
                next();
                return;
              }
            }

            req.isTeacher = false;
            next();
            return;
          })
          .catch((err) => {
            res.status(500).send({ message: err });
            return;
          });
      } else {
        return res.status(404).send({ message: "No Teacher found" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      return;
    });
};

isAdmin = (req, res, next) => {
  Moderator.findById(req.userId)
    .then((user) => {
      if (user) {
        Role.find({ _id: { $in: user.roles } })
          .then((roles) => {
            for (let i = 0; i < roles.length; i++) {
              if (roles[i].name === "admin") {
                next();
                return;
              }
            }

            res.status(403).send({ message: "Require Admin Role!" });
            return;
          })
          .catch((err) => {
            res.status(500).send({ message: err });
            return;
          });
      } else {
        return res.status(404).send({ message: "No Admin found" });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
      return;
    });
};

const authJwt = {
  verifyToken,
  isModerator,
  isAdmin,
  isTeacher,
  haveTeacherRole
};
module.exports = authJwt;
