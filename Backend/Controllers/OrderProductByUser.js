const OrderModel = require("../Models/OrderModel");

async function getUserOrders(req, res) {
  try {
    const userId = req.user.id;

    // user ke saare orders fetch kar lo (latest first)
    const orders = await OrderModel.find({ user: userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found for this user",
        orders: [],
      });
    }

    // unique productId ke orders filter karo
    const uniqueOrdersMap = new Map();
    for (const order of orders) {
      const productId = order.productId?.toString();
      if (!uniqueOrdersMap.has(productId)) {
        uniqueOrdersMap.set(productId, order);
      }
    }

    const uniqueOrders = Array.from(uniqueOrdersMap.values());

    res.status(200).json({
      success: true,
      message: "User unique orders fetched successfully",
      totalOrders: uniqueOrders.length,
      orders: uniqueOrders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user orders",
    });
  }
}

module.exports = { getUserOrders };
