// const db = require("../models");
// const Event = db.event;

// exports.createEvent = async (req, res) => {
//   try {
//     const event = new Event({
//       name: req.body.name,
//       description: req.body.description,
//       date: req.body.date,
//       location: req.body.location,
//       image: req.body.image,
//       link: req.body.link,
//     });

//     const response = await event.save();
//     return res
//       .status(200)
//       .send({ message: "Event created successfully", id: response._id });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ message: "Server failure" });
//   }
// };

// exports.getTopEvents = async (req, res) => {
//   try {
//     const topEvent = await Event.find().sort({ date: -1 }).limit(3);
//     return res.status(200).send(topEvent);
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ message: "Server failure" });
//   }
// };

// exports.deleteEventById = async (req, res) => {
//   try {
//     const response = await Event.deleteOne({ _id: req.body.id });
//     return res.status(200).send({ message: "Event deleted successfully" });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send({ message: "Server failure" });
//   }
// };

const db = require("../models");
const AlumniMeet = db.alumniMeets;

exports.createAlumniMeetPost = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).send({ message: "Server failure" });
  }
};
exports.getAlumniMeets = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).send({ message: "Server failure" });
  }
};
exports.deleteAlumniMeetById = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).send({ message: "Server failure" });
  }
};
exports.getAlumniTopMeets = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).send({ message: "Server failure" });
  }
};
