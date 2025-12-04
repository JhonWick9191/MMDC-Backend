// only get list of users who are not approved
const userModel  = require("../Models/UserModel")
async function getPendingUsers(req, res) {
    try {
        const users = await userModel.find({ isApproved: false });

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {
        console.log("Error fetching pending users:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

module.exports = { getPendingUsers };
