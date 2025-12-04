const OrderModel = require("../Models/OrderModel");

// ✅ USER: Get logged-in user's orders
async function getUserOrders(req, res) {
  try {
    const userId = req.user.id;

    // Find all orders placed by this user
    const orders = await OrderModel.find({ user: userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found for this user",
        orders: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "User orders fetched successfully",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user orders",
    });
  }
}

// ✅ ADMIN: Get all orders with user details

async function getAllOrdersForAdmin(req, res) {
  try {
    const orders = await OrderModel.find()
      .populate("user", "name email phone role") // Fetch specific user fields
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found",
        orders: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching all orders",
      error: error.message,
    });
  }
}

module.exports = { getUserOrders, getAllOrdersForAdmin };
