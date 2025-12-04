// Approve or Deny User
const userModel = require("../Models/UserModel");

async function approveOrDenyUser(req, res) {
    try {
        const userId = req.params.id;
        const { action } = req.body; // "approve" or "deny"

        // Check user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        // APPROVE
        if (action === "approve") {
            user.isApproved = true;
            user.isActive = true;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "User approved successfully!"
            });
        }

        // DENY → DELETE USER
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
