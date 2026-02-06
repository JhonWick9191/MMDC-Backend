const UserModel = require("../Models/UserModel");
const OrderModel = require("../Models/OrderModel");
const ProductModel = require("../Models/ProductUploadeModel");

/**
 * Get total number of users
 */
async function getTotalUserCount(req, res) {
    try {
        const totalUsers = await UserModel.countDocuments();
        return res.status(200).json({
            success: true,
            totalUsers,
        });
    } catch (error) {
        console.error("Error fetching total user count:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching total user count",
        });
    }
}

/**
 * Get category-wise product counts
 */
async function getCategoryWiseProductCount(req, res) {
    try {
        const categoryCounts = await ProductModel.aggregate([
            {
                $group: {
                    _id: "$Product_Category",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);

        return res.status(200).json({
            success: true,
            categoryCounts,
        });
    } catch (error) {
        console.error("Error fetching category-wise product counts:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching category-wise product counts",
        });
    }
}

/**
 * Get all orders with user and product details for admin
 */
async function getAdminOrders(req, res) {
    try {
        const orders = await OrderModel.find()
            .populate("user", "first_name last_name email phone_number role")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            totalOrders: orders.length,
            orders,
        });
    } catch (error) {
        console.error("Error fetching admin orders:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching admin orders",
        });
    }
}

module.exports = {
    getTotalUserCount,
    getCategoryWiseProductCount,
    getAdminOrders,
};
