import jwt from "jsonwebtoken";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, [], "Please Sign-in to continue!"));
    }
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload;
    console.log("payload", payload);
    req.user._id = payload._id;
    console.log("this is working");
    next();
  } catch (error) {
    return res.status(401).json(new ApiError(401, "Token Expired!", error));
  }
};
