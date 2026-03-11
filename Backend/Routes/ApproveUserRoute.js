const express = require("express")
const router = express.Router();
const {approveOrDenyUser} = require("../Controllers/ApproveUser")
const {getPendingUsers , GettingAlluser } = require("../Controllers/PendingUser")


router.post("/approveUser/:id" , approveOrDenyUser);
router.get("/pendingUsers", getPendingUsers)
router.get("/totalUserEmail", GettingAlluser )

module.exports = router;