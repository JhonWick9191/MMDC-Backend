const express = require("express");
const Router = express.Router()
const {ProductUploade,getAllExcelData} = require("../Controllers/ExcelDataUploadeController")
const {filterProducts} = require("../Controllers/FilterProducts")
const {upload} = require("../MiddleWares/UoloadeExceldata")

// uploade route 

Router.post("/upload", upload.single("file"), ProductUploade);

// get all data 

Router.get("/allProducts" , getAllExcelData)

// get product data as product type

Router.get("/categoryProduct", filterProducts )


module.exports = Router;
