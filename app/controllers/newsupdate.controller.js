const db = require("../models");
const NewsUpdate = db.newsUpdate;

exports.create = async (req, res) => {
  try {
    const newsUpdate = new NewsUpdate({
      title: req.body.title,
      link: req.body.link,
    });

    const response = await newsUpdate.save();
    return res
      .status(200)
      .send({ message: "News Update created successfully", id: response._id });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.getNewsUpdates = async (req, res) => {
  try {
    const newsUpdates = await NewsUpdate.find().sort({ date: -1 }).limit(3);
    return res.status(200).send(newsUpdates);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.deleteNewsUpdate = async (req, res) => {
  try {
    const response = await NewsUpdate.deleteOne({ _id: req.body.id });
    return res
      .status(200)
      .send({ message: "News Update deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};
