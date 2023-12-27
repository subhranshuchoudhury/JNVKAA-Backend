const IDValidator = require("../middlewares/validateMongoID");
const { isValidateInputID } = require("../middlewares/validateMongoID");
const db = require("../models");
const Image = db.image;
process.env.TZ = "Asia/Kolkata";
const multer = require("multer");
const uploadImage = multer().single("image");

exports.uploadImageServer = async (req, res) => {
  try {
    const reqUserId = req.userId;

    uploadImage(req, res, async (err) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Error in uploading the image" });
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

      const newImage = new Image({
        image: {
          contentType: req.file.mimetype,
          data: req.file.buffer,
          uploader: reqUserId,
        },
      });

      const savedImage = await newImage.save();
      return res.status(200).send({ _id: savedImage._id });
    });
  } catch (error) {
    return res.status(500).send({ message: "Image uploading failed" });
  }
};

exports.getImage = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) return res.status(400).send({ message: "Image id not found" });

    if (!IDValidator.isValidateInputID(id))
      return res.status(400).send({ message: "Invalid image id" });

    const doc = await Image.findById(id);
    if (!doc) return res.status(404).send({ message: "Image not found" });

    const imageBuffer = Buffer.from(doc.image.data, "base64");
    res.setHeader("Content-Type", doc.image.contentType);
    return res.send(imageBuffer);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Image processing failed" });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const id = req.body.id;
    const reqUserId = req.userId;
    await Image.findOneAndRemove({ _id: id, "image.uploader": reqUserId });
    return res.status(200).send({ message: "Image deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Deletion failed, try again later" });
  }
};
