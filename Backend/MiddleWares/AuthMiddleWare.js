const JWT = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");

require("dotenv").config();

async function auth(req, res, next) {

    try {
        // extract token form request body 
        let token = req.cookies?.token
            || req.body?.token
            || (req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "").trim() : null);

        // if token is missing 
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        // verify the token by using verify method 
        try {
            const payload = JWT.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload;

        } catch (error) {
            // verification issue 
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating the token in auth"
        });
    }
}


// is vender 
async function isVender(req, res, next) {

    try {
        if (req.user.role !== "Vendor") {
            return res.status(401).json({
                success: false,
                message: "This is the protected route for Vendors only"
            });
        }
        next();
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "User role can't be verified, please try again later"
        });

    }

}


// is admin 
async function isAdmin(req, res, next) {

    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is the protected route for Admin only"
            });
        }
        next();
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Admin role can't be verified, please try again later"
        });

    }

}

module.exports = { isVender, isAdmin, auth }
