

import jwt from "jsonwebtoken"
import { User } from "../Models/user.model.js"
import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"
import { decode } from "punycode"

export const verifyJWT = async (req, _, next) => {
console.log("within the authentication middleware");
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")


        if (!token) {
            return res.status(401).json(new ApiResponse(401, "Please Sign-in to continue!"))
        }
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log("payload is", payload);
        if (!payload.googleAuthenticated) {
            const user = await User.findById(payload?._id).select("-password -refreshToken")
            if (!user) {
                throw new ApiError(401, "Invalid Access Token")
            }
            req.user = user;
        } else {
            req.user = payload;
            req.user._id = payload._id.path;
           
        }
        next()
    } catch (error) {
      
        return new ApiError(401, error?.message || "Invalid access token");
    }

}