

import jwt from "jsonwebtoken"
import { User } from "../Models/user.model.js"
import { ApiError } from "../Utils/ApiError.js"
import { ApiResponse } from "../Utils/ApiResponse.js"

export const verifyJWT = async(req, _, next) => {
    console.log("auth")
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        
        if (!token) {
            return res.status(401).json(new ApiResponse(401,"Please Sign-in to continue!"))
        }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    req.user = user;
    next()
    } catch (error) {
        console.log("Enterign to the error section")
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
}