const db = require("../models");
const Teacher = db.teacher;
const Alumni = db.alumni;
process.env.TZ = "Asia/Kolkata"; // for correcting the timezone

exports.getMyProfile = async (req, res) => {

    try {
        const teacher = await Teacher.findById(req.userId).select(
            "-password -tempOTP -roles"
        );
        return res.status(200).send(teacher);
    } catch (error) {
        return res.status(500).send({ message: "Server failure" });
    }
};

exports.updateProfileTeacher = async (req, res) => {
    const updateData = req.body; // Assuming the request body contains the updated profileDetails
    const teacherID = req.userId;

    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherID,
            { $set: { profileDetails: updateData } },
            { new: true }
        ).select("profileDetails");

        if (!updatedTeacher) {
            return res.status(404).json({ message: "teacher not found" });
        }

        updatedTeacher.profileDetails.isProfileCompleted = true;

        const keysToExclude = [
            "isProfileCompleted",
            "profileImage",
            "premiumExpiry",
            "leavingYear",
        ];

        for (const key in updatedTeacher.profileDetails) {
            if (updatedTeacher.profileDetails.hasOwnProperty(key)) {
                if (keysToExclude.includes(key)) {
                    continue; // Skip checking for specified keys
                }

                const value = updatedTeacher.profileDetails[key];

                if (value === "" || value === undefined || value === null) {
                    updatedTeacher.profileDetails.isProfileCompleted = false;
                    break;
                }
            }
        }

        await updatedTeacher.save();

        return res.json({
            message: "Profile Details updated successfully",
            teacher: updatedTeacher,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 50;




        const reqUserDetails = await Alumni.findById(req.userId).select(
            "premiumExpiry"
        );

        // check if premium expired

        let isExpiredORFailed = !reqUserDetails?.premiumExpiry || reqUserDetails?.premiumExpiry < new Date()


        if (req.isTeacher)
            isExpiredORFailed = false;

        if (
            isExpiredORFailed
        ) {
            const teacher = await Teacher.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select(
                    "name profileDetails.joiningYear profileDetails.designation profileDetails.leavingYear profileDetails.profileImage"
                );
            return res.status(200).send(teacher);
        } else {
            const teacher = await Teacher.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select("-password -tempOTP -roles");
            return res.status(200).send(teacher);
        }
    } catch (error) {
        return res.status(500).send({ message: "Server failure" });
    }
};
