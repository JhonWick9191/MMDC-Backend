const express = require("express");
const Router = express.Router();

const {searchProducts} = require("../Controllers/searchingProductController");
const {chatBot} = require("../Controllers/CatBotAPI")

Router.get("/searchProducts" , searchProducts)
Router.post("/chatbot",chatBot)


module.exports = Router;
