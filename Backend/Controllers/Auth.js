const bcrypt = require("bcrypt")

const userModel = require("../Models/UserModel");

// signup route handler 

async function signup(req ,res){

    try{

        const { firstName ,  email ,   password, confrim_password,  role , aditional_info , image , products } = req.body

        // Perfrom some validation while in sighup
        
        // 1 - is to check user is already present or not 
 
         const existingUser = await userModel.findOne({email})

         if(existingUser){
            res.status(500).json({
                sucess:false,
                message:"User Allready present please login "
            })
         }

         // 2- validation if any of them is empty while signup then through the error 

        if(!firstName || !email || !password || !role || !confrim_password ){
            res.status(500).json({
                sucess:false,
                 message:"Please Fill All the necessary details"
            })
        }

    // 2.1 -  comparing both password [password  === confrim password ]

    if(password !== confrim_password){
       return res.status(500).json({
            sucess:false,
            message:"Password does't match please try again "
        })
    }

     // 3 - hasing the password 
    
    let hasingPassword

    try{
        hasingPassword = await bcrypt.hash(password , 10 )
        console.log(hasingPassword)
        console.log("Your Password has been hashed ")

    }catch(error){

        console.log("There is getting problem while hasing the password ")
        console.log(error)
        res.status(500).json({
            sucess:false,
            message:"Getting problem while hasing the password"
       
        })
    }
 

    //////////////////////// if user is valid user then make entry into the data base 

    const newUser = await userModel.create({
        firstName,
        email,
        password:hasingPassword,
        role
    })

    console.log(newUser)

    // if all this is done then send a responce to the user for submission 

    res.status(200).json({
        sucess:true,
        message:"You are signup sucessfully ! "
    })

        }catch(error){

          console.log("Getting problem while signup please check the signup code");
          console.log(error);
          res.status(500).json({
            sucess:false,
            message:"Getting problem while Signup please try again "
          })

    }


}

module.exports  = signup;
