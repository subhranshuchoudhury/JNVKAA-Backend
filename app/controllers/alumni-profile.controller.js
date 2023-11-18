const config = require("../config/auth.config");
const db = require("../models");
const Alumni = db.alumni;
const Role = db.role;
const otpGenerator = require("otp-generator");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
process.env.TZ = "Asia/Kolkata";

exports.updateProfile = async(req,res)=>{

}

exports.updateProfileAdmin = async(req,res)=>{
    
}