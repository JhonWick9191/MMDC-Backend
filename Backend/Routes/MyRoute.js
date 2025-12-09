const express = require("express")

const router = express.Router();
const {getUser} = require("../Controllers/Me")
router.get("/me" , getUser)

module.exports = router;