import axios from "axios";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { ApiError } from "../Utils/ApiError.js";
export const verifyHCaptcha = async (req, res, next) => {
  const token = req.body.token;
  console.log(req.body);

  if (!token) {
    return res
      .status(400)
      .json(new ApiResponse(false, 400, "Captcha token missing", {}));
  }

  try {
    const response = await axios.post(
      "https://hcaptcha.com/siteverify",
      new URLSearchParams({
        secret: process.env.HCAPTCHA_SECRET,
        response: token,
        remoteip: req.ip,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data;

    if (!data.success) {
      return res
        .status(403)
        .json(
          new ApiResponse(
            false,
            403,
            "Captcha verification failed",
            data["error-codes"]
          )
        );
    }

    next();
  } catch (error) {
    console.error("hCaptcha verification failed:", error.message);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Internal server error while verifying captcha",
          error
        )
      );
  }
};
