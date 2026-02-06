const express = require("express");
const Router = express.Router();
const { auth, isAdmin } = require("../MiddleWares/AuthMiddleWare");
const {
    getTotalUserCount,
    getCategoryWiseProductCount,
    getAdminOrders,
} = require("../Controllers/AdminDashboardController");

// Admin Dashboard stats routes
Router.get("/user-count", auth, isAdmin, getTotalUserCount);
Router.get("/category-counts", auth, isAdmin, getCategoryWiseProductCount);
Router.get("/orders", auth, isAdmin, getAdminOrders);

module.exports = Router;
