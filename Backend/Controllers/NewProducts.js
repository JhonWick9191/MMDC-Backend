// import the all excel data 
const ProductModel = require("../Models/ProductUploadeModel");

async function NewProduct(req ,res) {

    try{

        const Products = await ProductModel.find({new : "yes"})
        
        if(!Products){
            res.status(500).json({
                success:false,
                message:"Product not found "           
            })
        }

                   
   


        res.status(200).json({
            sucess:true,
            message:"Getting all new products",
            data:Products
        })    

        console.log(Products)



    }catch(error){
           console.log(error)
        res.status(500).json({
            sucess:false,
            message:"Getting error while fetching new products data ",
            data:error
        })

     
    }
    
}

module.exports = {NewProduct}