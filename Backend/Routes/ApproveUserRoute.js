const express = require("express")
const router = express.Router();
const {approveOrDenyUser} = require("../Controllers/ApproveUser")
const {getPendingUsers} = require("../Controllers/PendingUser")

router.post("/approveUser/:id" , approveOrDenyUser);
router.get("/pendingUsers", getPendingUsers)

module.exports = router;