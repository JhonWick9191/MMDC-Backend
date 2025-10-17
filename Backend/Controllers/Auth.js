const bcrypt = require("bcrypt")
const userModel = require("../Models/UserModel");
const AdminModel = require("../Models/AdminModel")
const OTPModel = require("../Models/OTPModel");
const ProfileModel = require("../Models/Profile")
const OTPGenerator = require("otp-generator")
const JWT = require('jsonwebtoken');
const UserModel = require("../Models/UserModel");

require("dotenv").config();
// send otp function 

// async function SendOTP(req, res) {

//     try {

//         const email = req.body;

//         //check isExisting user

//         const isExistingUser = await userModel.findOne({ email });

//         if (isExistingUser) {
//             console.log("User is Allready preset please login ")
//             return res.status(409).json({
//                 sucess: false,
//                 message: data,
//                 data: "User is allready present please login "
//             })
//         }

//         // create an otp and make otp unique 

//         function UniqueOTP() {
//             return OTPGenerator.generate(6, {
//                 digits: true,
//                 alphabets: false,
//                 upperCase: false,
//                 specialChars: false,
//             });
//         }

//         let otp;
//         let isUnique = false;
//         let maxRetries = 5;

//         // check is this otp is unique or not 

//         while (!isUnique && maxRetries > 0) {
//             otp = UniqueOTP();
//             const OTP_check = await OTPModel.findOne({ OTP: otp });
//             if (!OTP_check) {
//                 isUnique = true;
//             }
//             maxRetries--;
//         }

//         if (!isUnique) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Unable to generate unique OTP. Please try again.",
//             });
//         }

//         // make entry in db 

//         const OTP_Create = await OTPModel.create({
//             email,
//             OTP: otp,
//         })

//         console.log(OTP_Create);

//         // after all good then retrun responce 

//         res.status(200).json({
//             sucess: true,
//             message: "The otp is send to your gmail this otp will expires in 2 min ",
//             data: otp
//         })


//     } catch (error) {

//         console.log(error);
//         console.log("Geeting error while creating an OTP for signup ")
//         res.status(409).json({
//             sucess: false,
//             message: "Gettig problem while sending OTP please try again "
//         })

//     }

// }



// signup route handler 

async function signup(req, res) {
    try {
        const {
            first_name,
            last_name,
            email,
            phone_number,
            password,
            confrim_password,

        } = req.body;

        // 1 - Validation

        if (!first_name || !email || !password || !confrim_password || !phone_number) {
            return res.status(500).json({
                success: false,
                message: "Please Fill All the necessary details"
            });
        }

        // 2 - Password match
        if (password !== confrim_password) {
            return res.status(500).json({
                success: false,
                message: "Password doesn't match, please try again"
            });
        }

        // 2.1 - Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(500).json({
                success: false,
                message: "User already present, please login"
            });
        }

        // 3 - Hash the password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
            console.log("Password hashed successfully");
        } catch (error) {
            console.log("Error hashing password", error);
            return res.status(500).json({
                success: false,
                message: "Problem while hashing the password"
            });
        }

        // 4 - Create additional profile info
        const new_profile = await ProfileModel.create({
            gender: "Male",
            alternet_phone_number: "890987878",
            alternet_email: "singhas151@gma.com",
            about_user: "null"
        });

        // 5 - Create user
        const newUser = await userModel.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: "Vendor",
            phone_number,
            aditional_info: new_profile._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${first_name}${last_name}`,
        });

        // 6 - Generate JWT token

        const payload = {
            id: newUser._id,
            email: newUser.email,
            role: newUser.role
        };

        const token = JWT.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "48h"
        });


        // 7 - Send response with token
        newUser.password = null; // for security

        // Creating a jwt cookies 

        res.cookie("token" , token , {
            httpOnly:true,
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict",
            maxAge: 3 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            success: true,
            token,
            isExistingUser: newUser,            
            message: "You are signup successfully!"
        });

    } catch (error) {
        console.log("Error in signup:", error);
        res.status(500).json({
            success: false,
            message: "Problem while signup, please try again"
        });
    }
}


// function login 

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are require for enter"
            });
        }

        // Pehle userModel me check karo
        let isExistingUser = await userModel.findOne({ email });
        let role = null;

        // Agar userModel me nahi hai to AdminModel me check karo
        if (isExistingUser) {
            role = isExistingUser.role; // "Vendor" ya "User"
        } else {
            isExistingUser = await AdminModel.findOne({ email });
            if (isExistingUser) {
                role = "Admin";
            }
        }

        // Agar user/admin dono me nahi mila
        if (!isExistingUser) {
            return res.status(401).json({
                success: false,
                message: "Email is not exist please signup first"
            });
        }

        // Password match check
        const userPassord_match = await bcrypt.compare(password, isExistingUser.password);
        if (!userPassord_match) {
            return res.status(401).json({
                success: false,
                message: "Password does't match please try again"
            });
        }

        // JWT payload
        const payload = {
            email: isExistingUser.email,
            id: isExistingUser._id,
            role: role
        };

        const token = JWT.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "48hr"
        });

        isExistingUser.password = null;

        // Response
        res.status(200).json({
            success: true,
            token,
            isExistingUser,
            message: `You are logged in as ${role}`
        });

    } catch (error) {
        console.log("This error occurs in login function please check it once");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server did not responce please try again later"
        });
    }
}


//  function for create admin 


async function createAdmin(req, res) {
    try {
        const { email,password,first_name,last_name ,image } = req.body;

        // Check if admin already exists
        const existingAdmin = await AdminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin already exists!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await AdminModel.create({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${first_name}${last_name}`,
            role: "Admin"
        });

        console.log(newAdmin)

        res.status(200).json({
            success: true,
            message: "Admin created successfully!",
            admin: newAdmin
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error while creating admin",

        });
    }
}


// function for change password 

async function changePassword(req, res) {

    try {

        // get all data from request body 
        const { email, password, newPassword, confrimPassword } = req.body
        // perform some validation 
        if (!email || !password || !newPassword || !confrimPassword) {
            return res.status(400).json({
                success: false,
                message: "All Feilds are reqire to fill",

            })
        }
        // input feild  must not empty 

        const isExistingUser = await userModel.findOne({ email });

        console.log(isExistingUser.email == email)

        if (isExistingUser) {


            const check_password = await bcrypt.compare(password, isExistingUser.password);


            if (!check_password) {
                return res.status(401).json({
                    success: false,
                    message: "The old password does't match if you are forget the password then please reset the password "
                })
            }
            if (newPassword === password) {
                return res.status(400).json({
                    success: false,
                    message: "New password must be different from the old password"
                });
            }

            // enter old password and match the old password 
            if (newPassword !== confrimPassword) {
                return res.status(400).json({
                    success: false,
                    message: "New Passwrd and Confrim Password is not match please try again "
                })
            }
            // hasing the new passwrd 
            const hasingPassword = await bcrypt.hash(newPassword, 10)
            isExistingUser.password = hasingPassword;
            await isExistingUser.save()


        }
        return res.status(200).json({
            success: true,
            message: "Password successfully change ho gaya"
        })

    } catch (error) {
        console.log("Getting Problem while changeing  the passwrd of user ")
        console.log(error)

        return res.status(500).json({
            success: false,
            message: "Getting the error while Changing the password please try again "
        })
    }
}

// function for show user login profile 

async function UserLogin(req , res){

    try{
        const token = req.cookies.token;
        if(!token){
            console.log("Token is not present ")
            res.status(401).json({
                success:false,
                message:"Error comes in userLoginCookies beacuse toekn is not present"
            })
        }

         const decoded = JWT.verify(token, process.env.JWT_SECRET);
         
         console.log(decoded)
           res.status(200).json({
            success:true,
            user:decoded,
            message:"Token present "
           })

    }catch(error){
        console.log("Geeting error in Userlogin function")
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Getting error while geting the userLogin details"

        })
    }

}

module.exports = { signup, login, changePassword, createAdmin , UserLogin };
