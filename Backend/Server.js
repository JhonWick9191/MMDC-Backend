// exporting express 

const express = require("express");
const DbConnection = require("./Config/MongoDb")
const user = require("./Routes/User")
const app = express();

// getting env content 
require("dotenv").config();

const PORT = process.env.PORT || 5000; 

// adding parser for while geting req form body it is responsible for pass data from request body to the backend 
 app.use(express.json());

//creating defalut route 

app.get("/", (req ,res)=>(
    res.send("This is by defaul route ")
))

// adding Routes 

app.use("/api/v1" , user )

// Port of the app 

app.listen(PORT, ()=>{    
    console.log(`Server is started asjdon ${PORT}`)
    
})


// making  db connection 

DbConnection();


