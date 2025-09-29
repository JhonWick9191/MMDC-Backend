const mongoose = require("mongoose");
require("dotenv").config();

const DbConnection = () => {

    mongoose.connect(process.env.MongooseUrl)
        .then(() => {

            console.log("Data base is connected sucessfully !")

        })

        .catch((error) => {

            console.log("Getting error while make connection with the data base")
            console.log(error)
            process.exit(0)

        })
      
}

module.exports = DbConnection;


