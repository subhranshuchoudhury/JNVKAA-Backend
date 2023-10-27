const db = require("../models");
const Alumni = db.alumni;
const Post = db.post;
const Carousal = db.carousal;
process.env.TZ = "Asia/Kolkata";
const multer = require("multer");
const Moderator = require("../models/moderator.model");

const uploadImage = multer().single("image");

exports.createPostAlumni = async (req, res) => {
  uploadImage(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: "Server error" });
    } else {
      try {
        const alumni = await Alumni.findById(req.userId).select("name");

        if (!alumni) {
          return res.status(404).send({ message: "User not found" });
        }

        if (req.file === undefined)
          return res.status(400).send({ message: "Image not found" });

        if (req.file.size > 1000000) {
          return res.status(400).send({
            message: "Image size is large than 1mb",
          });
        }

        if (
          req.file.mimetype !== "image/jpeg" &&
          req.file.mimetype !== "image/png"
        ) {
          return res.status(400).send({
            message: "Image format is not supported (png or jpeg)",
          });
        }

        const post = new Post({
          title: req.body.title,
          description: req.body.description,
          links: req.body.links,
          hashtag: req.body.hashtag,
          date: req.body.date,
        });
        post.author.name = alumni.name;
        post.author.id = req.userId;
        post.image.data = req.file.buffer.toString("base64");
        post.image.contentType = req.file.mimetype;
        const posted = await post.save();
        return res
          .status(200)
          .send({ message: "Post created successfully", id: posted._id });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server failure" });
      }
    }
  });
};

exports.getLatestPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ timestamp: -1 })
      .limit(5)
      .select("author title image date views");
    return res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.postCarousal = async (req, res) => {
  uploadImage(req, res, async (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: "Server error" });
    } else {
      try {
        if (req.file === undefined)
          return res.status(400).send({ message: "Image not found" });

        if (req.file.size > 1000000) {
          return res.status(400).send({
            message: "Image size is large than 1mb",
          });
        }

        if (
          req.file.mimetype !== "image/jpeg" &&
          req.file.mimetype !== "image/png"
        ) {
          return res.status(400).send({
            message: "Image format is not supported (png or jpeg)",
          });
        }

        const post = new Carousal({
          title: req.body.title,
          date: req.body.date,
        });
        post.author.name = req.body.author;
        post.author.id = req.userId;
        post.image.data = req.file.buffer.toString("base64");
        post.image.contentType = req.file.mimetype;
        const posted = await post.save();
        return res
          .status(200)
          .send({ message: "Post created successfully", id: posted._id });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server failure" });
      }
    }
  });
};

exports.getCarousal = async (req, res) => {
  try {
    const posts = await Carousal.find()
      .sort({ timestamp: -1 })
      .limit(5)
      .select("author title image date");
    return res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};
