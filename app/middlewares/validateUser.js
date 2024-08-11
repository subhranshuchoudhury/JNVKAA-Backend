const db = require("../models");
const Alumni = db.alumni;
const z = require("zod");
const Teacher = db.teacher;
const validateRegister = (req, res, next) => {
  const schema = z
    .object({
      name: z
        .string()
        .min(3)
        .max(30)
        .regex(/^[a-zA-Z ]+$/),
      mobile: z
        .string()
        .length(10)
        .regex(/^[0-9]+$/),
      password: z.string().min(6),
    })
    .strict();
  const result = schema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    console.log(result.error.errors[0]);
    res.status(400).send({
      message: `${result.error.errors[0].path} ${result.error.errors[0].message}`,
    });
  }
};

const validateRegisterTeacher = (req, res, next) => {

  //'premiumExpiry', 'isProfileCompleted', 'profileImage', 'whatsappNo', 'designation', 'confirmPassword'"
  const schema = z
    .object({
      name: z
        .string()
        .min(3)
        .max(30)
        .regex(/^[a-zA-Z ]+$/),
      mobile: z
        .string()
        .length(10)
        .regex(/^[0-9]+$/),
      password: z.string().min(6),
      joiningYear: z.string().min(4).max(4),
      subject: z.string().min(3).max(30),
      leavingYear: z.string().min(0).max(4).optional(),
      profileImage: z.string().optional(),
      designation: z.string().min(3).max(30),
      whatsappNo: z.string().min(10).max(10),
      confirmPassword: z.string().min(6),
      isProfileCompleted: z.boolean(),
      premiumExpiry: z.any().optional(),
    })
    .strict();
  const result = schema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    console.log(result.error.errors[0]);
    res.status(400).send({
      message: `${result.error.errors[0].path} ${result.error.errors[0].message}`,
    });
  }
};

const validateLogin = (req, res, next) => {
  const schema = z
    .object({
      mobile: z
        .string()
        .length(10)
        .regex(/^[0-9]+$/),
      password: z.string().min(6),
    })
    .strict();
  const result = schema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    res.status(400).send({
      message: `${result.error.errors[0].path} ${result.error.errors[0].message}`,
    });
  }
};

const checkDuplicateMobile = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const alumni = await Alumni.findOne({ mobile });

    if (alumni) {
      if (alumni.verified)
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
    console.log(error);
    res.status(500).json({ message: "Server failure" });
  }
};

const checkDuplicateMobileTeacher = async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const teacher = await Teacher.findOne({ mobile });

    if (teacher) {
      if (teacher.verified)
        return res
          .status(400)
          .json({ message: "Phone no. is already in use!" });
      else {
        return res.status(301).json({
          message: "Please wait for the verification of your account.",
        });
      }
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server failure" });
  }
};

const validateSendOTP = (req, res, next) => {
  const schema = z
    .object({
      mobile: z
        .string()
        .length(10)
        .regex(/^[0-9]+$/),
    })
    .strict();
  const result = schema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    res.status(400).send({
      message: `${result.error.errors[0].path} ${result.error.errors[0].message}`,
    });
  }
};

const validateNumOTP = (req, res, next) => {
  const schema = z
    .object({
      mobile: z
        .string()
        .length(10)
        .regex(/^[0-9]+$/),
      otp: z
        .string()
        .length(4)
        .regex(/^[0-9]+$/),
    })
    .strict();
  const result = schema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    res.status(400).send({
      message: `${result.error.errors[0].path} ${result.error.errors[0].message}`,
    });
  }
};

const validateForgetPassword = (req, res, next) => {
  const schema = z
    .object({
      mobile: z
        .string()
        .length(10)
        .regex(/^[0-9]+$/),
      otp: z
        .string()
        .length(4)
        .regex(/^[0-9]+$/),
      password: z.string().min(6).max(20),
    })
    .strict();

  const result = schema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    return res.status(400).send({
      message: `${result.error.errors[0].path} ${result.error.errors[0].message}`,
    });
  }
};

const changePassword = (req, res, next) => {
  const schema = z
    .object({
      oldPassword: z.string().min(6),
      newPassword: z.string().min(6),
    })
    .strict();

  const result = schema.safeParse(req.body);
  if (result.success) {
    next();
  } else {
    return res.status(400).send({
      message: `${result.error.errors[0].path} ${result.error.errors[0].message}`,
    });
  }
};

// * Exports

const validateUser = {
  validateRegister,
  validateRegisterTeacher,
  checkDuplicateMobileTeacher,
  validateLogin,
  checkDuplicateMobile,
  validateSendOTP,
  validateNumOTP,
  validateForgetPassword,
  changePassword,
};

module.exports = validateUser;
