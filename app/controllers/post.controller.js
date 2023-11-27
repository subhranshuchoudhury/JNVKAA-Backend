const db = require("../models");
const Alumni = db.alumni;
const Post = db.post;
const YoutubePost = db.youtubePost;
const Carousal = db.carousal;
process.env.TZ = "Asia/Kolkata";
const multer = require("multer");
// const Moderator = require("../models/moderator.model");
const uploadImage = multer().single("image");

// user create post

exports.createPostAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.userId).select("name");

    if (!alumni) {
      return res.status(404).send({ message: "User not found" });
    }

    const post = new Post({
      title: req.body.title,
      description: req.body.description,
      links: req.body.links,
      hashtag: req.body.hashtag,
      date: req.body.date,
      imageLink: req.body.imageSrcId,
      isYoutube: req.body.isYoutube,
      youtubeLink: req.body.ytLink,
      externalLink: req.body.externalLink,
    });
    post.author.name = alumni.name;
    post.author.id = req.userId;

    const posted = await post.save();
    return res
      .status(200)
      .send({ message: "Post created successfully", id: posted._id });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

// moderator create post

exports.createYoutubePost = async (req, res) => {
  function getVideoId(url) {
    var urlObj = new URL(url);
    var videoId = "";

    if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname === "www.youtube.com") {
      videoId = urlObj.searchParams.get("v");
    }

    return videoId;
  }

  try {
    const ytVideoID = getVideoId(req.body.link);

    if (ytVideoID === "" || ytVideoID === undefined || ytVideoID === null) {
      return res.status(400).send({ message: "Invalid Youtube Video Link" });
    }
    const youtubePost = new YoutubePost({
      description: req.body.description,
      title: req.body.title,
      link: ytVideoID,
    });

    const response = await youtubePost.save();
    return res
      .status(200)
      .send({ message: "Post created successfully", id: response._id });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

// get the youtube post

exports.getYoutubePosts = async (req, res) => {
  try {
    const ytPosts = await YoutubePost.find().limit(3).sort({ date: -1 });
    return res.status(200).send(ytPosts);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

// get latest posts

exports.getLatestPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ timestamp: -1 })
      .limit(5)
      .select("author title imageLink date views");
    return res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const posts = await Post.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .skip(skip)
      .select("author title imageLink date views");
    return res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};
// get post by id

exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    post.views += 1;
    await post.save();
    return res.status(200).send(post);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

// get post by search

exports.getPostSearch = async (req, res) => {
  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: `^${req.query?.title}`, $options: "i" } }, // * i : non-case sensitive
        {
          description: { $regex: `^${req.query?.description}`, $options: "i" },
        },
        {
          "author.name": {
            $regex: `^${req.query?.author}`,
            $options: "i",
          },
        },

        {
          hashtag: {
            $elemMatch: {
              $regex: `^${req.query?.hashtag}`,
              $options: "i",
            },
          },
        },
      ],
    })
      .sort({ timestamp: -1 })
      .select("author title date views hashtag");

    return res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

// user post carousal

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

// user delete post

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.body;
    const post = await Post.findById(id).select("author");
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    if (post.author.id.toString() !== req.userId) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    await post.deleteOne();
    return res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

// delete post by moderator

exports.deletePostByModerator = async (req, res) => {
  try {
    const { id } = req.body;
    const post = await Post.findById(id).select("author");
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    await post.deleteOne();
    return res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

// get carousal posts

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

// delete carousal post

exports.deleteCarousal = async (req, res) => {
  try {
    const post = await Carousal.findById(req.body.id).select("author");
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }
    await post.deleteOne();
    return res.status(200).send({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};
