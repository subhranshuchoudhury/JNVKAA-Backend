const db = require("../models");
const YoutubePost = db.youtubePost;

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

exports.getTopYoutubePosts = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 3;
    const topYoutubePost = await YoutubePost.find()
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip);
    return res.status(200).send(topYoutubePost);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.deleteYoutubePostById = async (req, res) => {
  try {
    const response = await YoutubePost.deleteOne({ _id: req.body.id });
    return res
      .status(200)
      .send({ message: "YoutubePost deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.getYoutubePosts = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const events = await YoutubePost.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).send(events);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.getYoutubePostById = async (req, res) => {
  try {
    const event = await YoutubePost.findById(req.params.id);
    event.views += 1;
    await event.save();
    return res.status(200).send(event);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};
