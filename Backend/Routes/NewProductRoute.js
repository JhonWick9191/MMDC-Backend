const express = require("express");
const router = express.Router();

const {NewProduct} = require("../Controllers/NewProducts");

router.get("/newProducts" , NewProduct)

module.exports = router;