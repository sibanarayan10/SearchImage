import { oauth2Client } from "../Utils/googleAuth.js";
import { User } from "../Models/user.model.js";

import { uploadFile } from "../Utils/cloudinary.js";
import { Image } from "../Models/image.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error happen at :");
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};
const SignUp = async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;
  console.log(req.body);

  try {
    if (
      [fullName, password, confirmPassword, email].some((item) => !item.trim())
    ) {
      return res
        .status(400)
        .json(new ApiError(400, "All fields are required!"));
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res
        .status(402)
        .json(
          new ApiError(
            402,
            "User Already exist with this Email!Try with another"
          )
        );
    }
    if (password !== confirmPassword) {
      return res.status(400).json(new ApiError(400, "Password mismatched!"));
    }

    const user = await User.create({ fullName, email, password });
    console.log("completed upto here");

    return res.status(201).json(new ApiResponse(200, "Sign-Up successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Server is not responding for some reason.Try after some time",
          error
        )
      );
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    if (!email || !password) {
      throw new ApiError(400, "Email or password is required");
    }
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      throw new ApiError(
        404,
        "User does not exist!,Please Sign up to create an Account"
      );
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json(new ApiError(400, "Password for this email is incorrect!"));
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-Password -refreshToken"
    );

    if (!loggedInUser) {
      return res
        .status(402)
        .json(new ApiResponse(402, "user not authenticated!"));
    }
    const options = {
      httpOnly: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    } else {
      return res
        .status(500)
        .json(new ApiError(500, "An unexpected error occurred", error.message));
    }
  }
};
const updateProfile = async (req, res) => {};
const redirectURL = async (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });

  res.send(authUrl);
};

const oauthCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(500).json({ error: "Google authentication failed!" });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Access Token and Refresh Tokens:", tokens);

    oauth2Client.setCredentials(tokens);

    const userInfoResponse = await oauth2Client.request({
      url: "https://www.googleapis.com/userinfo/v2/me",
    });

    console.log("User Info:", userInfoResponse);
    const userData = userInfoResponse.data;
    const userId = userData.id;
    const accessToken = jwt.sign(
      {
        _id: new ObjectId(userId),

        FirstName: userData.given_name,
        LastName: userData.family_name,
        Email: userData.email,
        googleAuthenticated: true,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
    const refreshToken = jwt.sign(
      {
        _id: new ObjectId(userId),
        FirstName: userData.given_name,
        LastName: userData.Family_name,
        Email: userData.email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 3600 * 24000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,

      maxAge: 30 * 24 * 3600 * 1000,
    });

    return res.redirect("http://localhost:5176/");
  } catch (error) {
    console.error("Error during authentication:", error.message);
    return res.status(500).send("Authentication failed");
  }
};

const getAllImage = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(401, [], "User not Authenticated!"));
    }

    const img = await Image.find({ owner: user._id });

    if (img.length === 0) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, [], "No images found. Please upload an image.")
        );
    }
    console.log(img);
    return res
      .status(200)
      .json(new ApiResponse(200, img, "Images fetched successfully."));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, [], "An error occurred while fetching images.")
      );
  }
};

const addImage = async (req, res) => {
  const { Title, Description } = req.body;
  console.log(req.body);
  try {
    if (!Title) {
      return res.status(400).json({ error: "Title is a required field!" });
    }
    console.log(req.file);
    const localImagePath = req.file?.path;
    if (!localImagePath) {
      return res
        .status(500)
        .json({ error: "Something went wrong while saving the file locally." });
    }

    const upload = await uploadFile(localImagePath);
    console.log(upload);
    const image = new Image({
      Title,
      Description,
      owner: req.user._id,
      cloudinary_Assetid: upload.asset_id,
      cloudinary_publicId: upload.public_id,
    });
    console.log(image);
    await image.save();

    return res.status(200).json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Error uploading image:", error);
    return new ApiError(500, "Error :", error);
  }
};

const deleteAll = async (req, res) => {
  const img = await Image.find({ owner: req.user });
  return img;
};
const deleteUsers = async (req, res) => {
  try {
    const result = await User.deleteMany();
    res.status(200).json({ message: "All users deleted successfully", result });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting users", error: error.message });
  }
};
const deleteImage = async (req, res) => {
  try {
    const { imgId } = req.params;
    console.log("params", req.params);
    if (!imgId) {
      return res.status(400).json(new ApiError(400, "something went wrong"));
    }
    console.log("Image ID to delete:", imgId);

    const result = await Image.deleteOne({ _id: imgId });
    if (result.deletedCount === 1) {
      return res
        .status(200)
        .json(new ApiResponse(200, "Image deleted successfully"));
    }

    return res.status(404).json(new ApiError(404, "Image not found"));
  } catch (error) {
    console.error("Error deleting image:", error);
    return res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong! Try again after some time")
      );
  }
};
const editImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, desc } = req.body;
    console.log(title, desc);
    const updatedImage = await Image.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && title !== "" && { Title: title }),
        ...(desc !== undefined && desc !== "" && { Description: desc }),
      },
      { returnDocument: "after" } // `new: true` ensures the returned document is the updated one
    );

    if (!updatedImage) {
      return res.status(404).json(new ApiError(404, "Image not found"));
    }

    console.log("Updated Image:", updatedImage);
    return res
      .status(200)
      .json(new ApiResponse(200, updatedImage, "Updated Successfully."));
  } catch (error) {
    console.error("Error updating image:", error);
    return res
      .status(502)
      .json(new ApiError(502, "Something went wrong", error));
  }
};
const getallUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(new ApiResponse(200, users));
  } catch (error) {
    return res
      .status(400)
      .json(new ApiError(400, "something went wrong", error));
  }
};

const getUserDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const images = await Image.find({ owner: id }).select(
      "cloudinary_publicId"
    );

    const user = await User.findById(id);

    if (!images || images.length === 0) {
      return res.status(404).json(new ApiResponse(404, [], "No images found!"));
    }

    if (!user) {
      return res.status(404).json(new ApiResponse(404, [], "User not found!"));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          images,
          email: user.email,
          name: user.fullName,
        },
        "Images fetched successfully!"
      )
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Error fetching images", error));
  }
};

const logoutUser = async (req, res) => {
  const id = req.user?._id;
  console.log(req.user);
  console.log(req.user?._id);
  if (!id) {
    return res.status(401).json(new ApiResponse(401, "Unauthorized!"));
  }
  try {
    await User.findByIdAndUpdate(
      id,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    res
      .clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      })
      .clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "None",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json(new ApiResponse(200, "User logged out successfully"));
  } catch (error) {
    console.error("Logout Error:", error);
    res
      .status(500)
      .json(new ApiError(500, "Error occurred while logging out", error));
  }
};

export {
  logoutUser,
  redirectURL,
  oauthCallback,
  SignUp,
  loginUser,
  getAllImage,
  deleteAll,
  updateProfile,
  addImage,
  deleteUsers,
  deleteImage,
  editImage,
  getallUsers,
  getUserDetail,
};
