const db = require("../models");
const Event = db.event;

exports.createEvent = async (req, res) => {
  try {
    const event = new Event({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      image: req.body.image,
      link: req.body.link,
    });

    const response = await event.save();
    return res
      .status(200)
      .send({ message: "Event created successfully", id: response._id });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.getTopEvents = async (req, res) => {
  try {
    const topEvent = await Event.find().sort({ date: -1 }).limit(3);
    return res.status(200).send(topEvent);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.deleteEventById = async (req, res) => {
  try {
    const response = await Event.deleteOne({ _id: req.body.id });
    return res.status(200).send({ message: "Event deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const events = await Event.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .select("-description");

    return res.status(200).send(events);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    return res.status(200).send(event);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};
