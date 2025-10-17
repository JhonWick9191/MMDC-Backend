const express = require("express");
const Porducts = require("../Models/ProductUploadeModel")

async function filterProducts(req ,res){

    try{

        const {type} = req.query;

            if(!type){
            return res.status(500).json({
                success:false,
                message:"This Product is not in DB"
            })
        }
        const filterProducts = await Porducts.find({Product_Type : type})
          if (filterProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No products found with type: ${type}`,
      });
    }
        console.log("Up side of filter products ")
        console.log(filterProducts)

        res.status(200).json({
            sucess:"true",
            message:filterProducts,
            data:"Data get Sucess fully "
        })

    


    }catch(error){
        console.log("Error comes from filer products data ")
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Getting error while filtering the data"
        })
    }
}

module.exports = {filterProducts}