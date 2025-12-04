const express = require("express");
const router = express.Router();
const upload = require("../MiddleWares/UploadeGst");
const { extractGST } = require("../Controllers/AddGst");

// Excel upload route (only GST extract)
router.post("/extract-gst", upload.single("excelFile"), extractGST);

module.exports = router;
