const db = require("../models");
const Moderator = db.moderator;
const z = require("zod");
const validateRegister = (req, res, next) => {
  const schema = z.object({
    name: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z ]+$/)
      .optional(),
    mobile: z
      .string()
      .length(10)
      .regex(/^[0-9]+$/),
    password: z.string().min(6).max(20),
    
  });
  const result = schema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    console.log(result.error);
    res.status(400).send({
      message: result.error.errors[0].message,
    });
  }
};

const validateLogin = (req, res, next) => {
  const schema = z.object({
    
    mobile: z
      .string()
      .length(10)
      .regex(/^[0-9]+$/),
    password: z.string().min(6).max(20),
  });
  const result = schema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    res.status(400).send({
      message: result.error.errors[0].message,
    });
  }
};

const checkDuplicateMobile = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const user = await Moderator.findOne({ mobile });

    if (user) {
      if (user.verified)
        return res
          .status(400)
          .json({ message: "Phone no. is already in use!" });
      else {
        return res.status(301).json({
          message: "Account already exists. Please verify your account.",
        });
      }
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// * Exports

const validateModerator = {
  validateRegister,
  validateLogin,
  checkDuplicateMobile
};

module.exports = validateModerator;
