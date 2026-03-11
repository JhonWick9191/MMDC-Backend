// only get list of users who are not approved
const { currentLineHeight } = require("pdfkit");
const userModel = require("../Models/UserModel")
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

async function GettingAlluser(req, res) {
    try {

        const loginUser = await userModel.find({}, { email: 1 })

        console.log("Getting all user")
        console.log(loginUser)

        return res.status(200).json({
            sucess: true,
            message: "Getting all user data",
            email:loginUser
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            sucess: false,
            message: "Getting error while fetching email of all user "
        })

    }
}

module.exports = { getPendingUsers, GettingAlluser };
