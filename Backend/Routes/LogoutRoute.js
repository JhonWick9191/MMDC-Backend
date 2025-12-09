// Routes/LogoutRoute.js
const express = require('express');
const router = express.Router();

// Import controller
const { logoutUser } = require('../Controllers/LogoutController');

// POST /api/v1/logout - Logout user
router.post('/logout', logoutUser);

module.exports = router;
