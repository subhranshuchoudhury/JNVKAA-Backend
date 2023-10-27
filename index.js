const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
// * Cors

app.use((req, res, next) => {
  res.header({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE",
  });
  next();
});

app.use(cors());

// * receive JSON parsed body

// for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

app.get("/", (req, res) => {
  res.json({
    message: [{ owner: "JNVKAA" }],
  });
});

// * creating user role

const createRoles = async () => {
  Role.estimatedDocumentCount().then((count) => {
    if (count === 0) {
      new Role({
        name: "admin",
      })
        .save()
        .then((resp) => {
          console.log("--> ADMIN CREATED");
        })
        .catch((err) => {
          console.log("ERROR WHILE CREATING ADMIN");
        });

      new Role({
        name: "moderator",
      })
        .save()
        .then((resp) => {
          console.log("--> MODERATOR CREATED");
        })
        .catch((err) => {
          console.log("ERROR WHILE CREATING MODERATOR");
        });

      new Role({
        name: "teacher",
      })
        .save()
        .then((resp) => {
          console.log("--> TEACHER CREATED");
        })
        .catch((err) => {
          console.log("ERROR WHILE CREATING ADMIN");
        });

      new Role({
        name: "alumni",
      })
        .save()
        .then((resp) => {
          console.log("--> ALUMNI CREATED");
        })
        .catch((err) => {
          console.log("ERROR WHILE CREATING USER");
        });
    } else {
      console.log("--> Roles already created");
    }
  });
};

// * connection to database

db.mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(async () => {
    console.log("--> Connected to database");
    await createRoles();
  })
  .catch((err) => {
    console.log("--> Error connecting to database", err);
    process.exit();
  });

// * routes

require("./app/routes/alumni-auth.route")(app);
require("./app/routes/moderator-auth.route")(app);
require("./app/routes/post.route")(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`--> SERVER ACTIVE ON ${PORT}`);
});
