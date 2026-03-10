// Approve or Deny User
const userModel = require("../Models/UserModel");
const mailSender = require("../utils/MailSender")
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

//             await mailSender(
//                 user.email,
//                 "Your ID has been verified. You can now login",
//                 `
//   <div style="font-family: Arial, sans-serif; text-align:center;">
    
//     <img 
//       src="https://pub-2b1f343884754239835449d2250d43a1.r2.dev/2.png"
//       alt="Music and More"
//       style="width:100%; max-width:600px; border-radius:8px;"
//     />

//     <h1>Welcome ${user.first_name} 🎵</h1>

//     <p>Your ID has been verified successfully.</p>

//     <p>You can now login and explore <b>Music and More</b>.</p>

//     <a href="https://yourwebsite.com/login"
//       style="display:inline-block; margin-top:20px; padding:12px 25px; background:#ff6b00; color:white; text-decoration:none; border-radius:5px;">
//       Login Now
//     </a>

//   </div>
//   `
//             );

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
