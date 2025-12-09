const JWT = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");
const AdminModel = require("../Models/AdminModel"); // ✅ AdminModel import

async function getUser(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    const payload = JWT.verify(token, process.env.JWT_SECRET);
    console.log("Token payload:", payload); // Debug

    let user = null;

    // ✅ Check both UserModel AND AdminModel
    if (payload.role === "Admin") {
      user = await AdminModel.findById(payload.id).select("-password");
      if (user) {
        user.role = "Admin"; // Add role to response
      }
    } else {
      user = await UserModel.findById(payload.id).select("-password");
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // ✅ Ensure image field exists
    user.image = user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name || 'User')}&background=4F46E5&color=fff&size=128`;

    res.status(200).json({ 
      success: true, 
      user 
    });

  } catch (error) {
    console.error("Me route error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}

module.exports = {getUser};
