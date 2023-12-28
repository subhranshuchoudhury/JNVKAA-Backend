const db = require("../models");
const AlumniMeet = db.alumniMeets;

exports.createAlumniMeetPost = async (req, res) => {
  try {
    const alumnimeet = new AlumniMeet({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      location: req.body.location,
      image: req.body.image,
      link: req.body.link,
    });

    const response = await alumnimeet.save();
    return res
      .status(200)
      .send({ message: "Alumni Meet created successfully", id: response._id });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server failure" });
  }
};
exports.getAlumniMeets = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const alumniMeets = await AlumniMeet.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).send(alumniMeets);
  } catch (error) {
    return res.status(500).send({ message: "Server failure" });
  }
};
exports.getAlumniMeetByID = async (req, res) => {
  try {
    const alumniMeet = await AlumniMeet.findById(req.params.id);
    if (alumniMeet) {
      alumniMeet.views += 1;
      await alumniMeet.save();
    }
    return res.status(200).send(alumniMeet);
  } catch (error) {
    console.log("ALUMNI CONTROLLER: ", error);
    return res.status(500).send({ message: "Server failure" });
  }
};
exports.deleteAlumniMeetById = async (req, res) => {
  try {
    const response = await AlumniMeet.findByIdAndDelete(req.params.id);
    if (!response) {
      return res.status(404).send({ message: "Alumni Meet not found" });
    }
    return res
      .status(200)
      .send({ message: "Alumni Meet deleted successfully" });
  } catch (error) {
    return res.status(500).send({ message: "Server failure" });
  }
};
exports.getAlumniTopMeets = async (req, res) => {
  try {
    const alumniMeets = await AlumniMeet.find()
      .sort({ created_at: -1 })
      .limit(3);

    return res.status(200).send(alumniMeets);
  } catch (error) {
    return res.status(500).send({ message: "Server failure" });
  }
};
