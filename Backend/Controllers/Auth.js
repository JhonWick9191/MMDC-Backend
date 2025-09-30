const bcrypt = require("bcrypt")
const userModel = require("../Models/UserModel");
const OTPModel = require("../Models/OTPModel");
const ProfileModel = require("../Models/Profile")
const OTPGenerator = require("otp-generator")
const JWT = require('jsonwebtoken');

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
            role,
            // otp,

        } = req.body

        // Perfrom some validation while in sighup

        // 1- validation if any of them is empty while signup then through the error 

        if (! first_name || !email || !password || !role || !confrim_password || !phone_number) {
            res.status(500).json({
                success: false,
                message: "Please Fill All the necessary details"
            })
        }

        // 2 -  comparing both password [password  === confrim password ]

        if (password !== confrim_password) {
            return res.status(500).json({
                success: false,
                message: "Password does't match please try again "
            })
        }
        // 2.1  - is to check user is already present or not 

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            res.status(500).json({
                success: false,
                message: "User Allready present please login "
            })
        }

        // find most recent  otp for match 

        // const recentOTP = await OTPModel.find({ email }).sort({ createdAt: -1 }).limit(1)
        // console.log(recentOTP)

        // validate otp 

        // if (recentOTP.otp !== otp) {
        //     return res.status(401).josn({
        //         success: false,
        //         message: "The OTP does't match "
        //     })
        // }

        // 3 - hasing the password 

        let hasingPassword

        try {

            hasingPassword = await bcrypt.hash(password, 10)
            console.log(hasingPassword)
            console.log("Your Password has been hashed ")

        } catch (error) {

            console.log("There is getting problem while hasing the password ")
            console.log(error)
            res.status(500).json({
                success: false,
                message: "Getting problem while hasing the password"

            })
        }

        // creating aditional info of user 

        const new_profile = await ProfileModel.create({
            gender: "Male",
            alternet_phone_number: "890987878",
            alternet_email: "singhas151@gma.com",
            about_user: "null"
        })




        //////////////////////// if user is valid user then make entry into the data base 

        const newUser = await userModel.create({
            first_name,
            last_name,
            email,
            password: hasingPassword,
            role,
            phone_number,
            aditional_info: new_profile._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${ first_name}${last_name}`,

        })

        console.log(newUser)

        // if all this is done then send a responce to the user for submission 

        res.status(200).json({
            success: true,
            message: "You are signup sucessfully ! "
        })

    } catch (error) {

        console.log("Getting problem while signup please check the signup code");
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Getting problem while Signup please try again "
        })

    }


}


async function login(req, res) {
    try {

        // get email and passord form request body 

        const { email,
            password
        } = req.body

        // preform some validation while checking the code 

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are require for enter "
            })
        }

        // see that email is preset in data base or not 

        const isExistingUser = await userModel.findOne({ email })

        if (!isExistingUser) {
            console.log("This error comes form login is exist code if user is allready exist ")
            return res.status(401).json({
                success: false,
                message: "Email is not exist please signup first "
            })
        }

        // match password 

        const userPassord_match = await bcrypt.compare(password, isExistingUser.password)

        if (!userPassord_match) {

            return res.status(401).json({
                success: false,
                message: "Password does't match please try again "
            })

        }
        // Generate the JWT tokens

        //  creating payloade 

        const payload = {
            email: isExistingUser.email,
            id: isExistingUser._id,
            role: isExistingUser.role
        }

        const token = JWT.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2hr"
        })

        isExistingUser.token = token
        isExistingUser.password = null

        // Create the cookies 

        // create options 

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        // if all good then return sucess 
        console.log("Your login is working correctly ")
        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            isExistingUser,
            message: "You are loged in "
        })

        console.log(isExistingUser)

    } catch (error) {
        console.log("This error is occurs in login function please check it once ")
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Server did not responce please try again later"
        })

    }
}


async function changePassword(req,res) {

    try {

        // get all data from request body 
        const { email , password , newPassword ,confrimPassword } = req.body
        // perform some validation 
        if (!email || !password || !newPassword || !confrimPassword) {
            return res.status(400).json({
                success: false,
                message: "All Feilds are reqire to fill",

            })
        }
        // input feild  must not empty 

        const isExistingUser = await userModel.findOne({email});

        console.log(isExistingUser.email == email)

        if (isExistingUser) {
            
                      
            const check_password = await bcrypt.compare(password ,isExistingUser.password);
           

            if (!check_password) {
                return res.status(500).json({
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

module.exports = { signup , login ,  changePassword };
