const express = require("express");
const Router = express.Router();

const {searchProducts} = require("../Controllers/searchingProductController");

Router.get("/searchProducts" , searchProducts)


module.exports = Router;
