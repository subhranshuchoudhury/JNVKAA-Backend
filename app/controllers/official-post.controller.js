const db = require("../models");
const OfficialPost = db.officialPost;

// Official Posts

exports.createOfficialPost = async (req, res) => {
  try {
    const post = new OfficialPost({
      title: req.body.title,
      description: req.body.description,
      links: req.body.links,
      date: req.body.date,
      imageLink: req.body.imageLink,
      externalLink: req.body.externalLink,
    });

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

exports.getOfficialPosts = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const posts = await OfficialPost.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("author title imageLink date views");
    return res.status(200).send(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.getOfficialPostByID = async (req, res) => {
  try {
    const post = await OfficialPost.findById(req.params.id);
    post.views += 1;
    await post.save();
    return res.status(200).send(post);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.deleteOfficialPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await OfficialPost.findById(id);
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
