const userModel = require("../Models/UserModel");
const mailSender = require("../utils/MailSender");
require("dotenv").config();

async function approveOrDenyUser(req, res) {
    try {

        const userId = req.params.id;
        const { action } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        // APPROVE USER
        if (action === "approve") {

            user.isApproved = true;
            user.isActive = true;

            await user.save();

            // Send approval email
            await mailSender(
                user.email,
                "Account Approved ✅",
                `
                <h2>Hello ${user.first_name},</h2>
                <p>🎉 Congratulations!</p>
                <p>Your account has been <b>approved</b> by the admin.</p>
                <p>You can now login and start using the platform.</p>
                <br/>
                <a href="https://musicandmore.co.in/login">
                    Click here to Login
                </a>
                <br/><br/>
                <p>Regards,</p>
                <b>Music & More Team</b>
                `
            );

            return res.status(200).json({
                success: true,
                message: "User approved and email sent successfully!"
            });
        }

        // DENY USER
        if (action === "deny") {

            await userModel.findByIdAndDelete(userId);

            return res.status(200).json({
                success: true,
                message: "User denied and deleted successfully!"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Invalid action"
        });

    } catch (error) {

        console.log("Approval Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error during approval"
        });
    }
}

module.exports = { approveOrDenyUser };