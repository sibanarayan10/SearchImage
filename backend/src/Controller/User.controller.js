import { User } from "../Models/User.model.js";

import { uploadFile } from "../Utils/cloudinary.js";
import { Image } from "../Models/Image.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import mongoose from "mongoose";
import { Like } from "../Models/Like.model.js";
import { Follow } from "../Models/Follow.model.js";
import cloudinary from "cloudinary";

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
const signUp = async (req, res) => {
  const { fullname, email, phone, password, confirm_password } = req.body;
  console.log(req.body);

  try {
    if (
      [fullname, phone, password, confirm_password, email].some(
        (item) => !item.trim()
      )
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
    if (password !== confirm_password) {
      return res.status(400).json(new ApiError(400, "Password mismatched!"));
    }

    const user = await User.create({ fullname, phone, email, password });

    return res
      .status(201)
      .json(new ApiResponse(200, user, "Sign-Up successfully"));
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
      "-password -refreshToken"
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
// user is deleting own account
const deleteAccount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const id = req.user?._id || req.params.id;
    if (!id) {
      await session.abortTransaction();
      return res.status(400).json(new ApiResponse(400, [], "Id can't be null"));
    }

    await User.deleteOne({ _id: id }).session(session);

    const images = await Image.find({ uploadedBy: id }).session(session);

    await Promise.all(
      images.map((img) => cloudinary.uploader.destroy(img.cloudinary_publicId))
    );

    await Image.deleteMany({ uploadedBy: id }).session(session);
    await Follow.deleteMany({ follower: id }).session(session);
    await Follow.deleteMany({ following: id }).session(session);
    await Like.updateMany({ likedBy: id }, { $pull: { likedBy: id } }).session(
      session
    );

    await session.commitTransaction();
    return res
      .status(200)
      .json(new ApiResponse(200, [], "Account deleted successfully"));
  } catch (error) {
    await session.abortTransaction();
    return res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong while deleting account", error)
      );
  } finally {
    session.endSession();
  }
};

// this need to be modified
const addImage = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json(new ApiResponse(401, [], "Unauthorized"));
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  const files = req.files;
  const metadata = req.body.metadata;

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = file.path;

      const upload = await uploadFile(filePath);
      console.log(upload.public_id);

      const title = metadata[i].title;
      const desc = metadata[i].desc;
      const tags = JSON.parse(metadata[i].tags);

      console.log({ title, desc });

      const image = await Image.create(
        [
          {
            title,
            desc,
            tags,
            cloudinary_publicId: upload.public_id,
            uploadedBy: req.user._id,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Image uploaded successfully"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error uploading image:", error);
    return res.status(500).json({ error: "Upload failed", details: error });
  }
};

// user uploaded images
// response integrity
const getUploads = async (req, res) => {
  const user = req.user;
  const { skip = 0, limit = 10 } = req.query;

  if (!user) {
    return res
      .status(401)
      .json(new ApiResponse(401, [], "Unauthorized access"));
  }

  try {
    const images = await Image.find({ uploadedBy: user._id })
      .skip(Number(skip))
      .limit(Number(limit))
      .select("cloudinary_publicId _id uploadedBy")
      .lean();
    if (images.length === 0) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, [], "No images found. Please upload an image.")
        );
    }

    const currUser = await User.findById(user._id).select("savedImage").lean();

    const result = await Promise.all(
      images.map(async (image) => {
        const isLiked = await Like.countDocuments({
          image: image._id,
          likedBy: user._id,
        });

        const isSaved = currUser.savedImage?.some(
          (imgId) => imgId.toString() === image._id.toString()
        );

        return {
          ...image,
          isLiked: isLiked > 0,
          isSaved: !!isSaved,
        };
      })
    );

    return res
      .status(200)
      .json(new ApiResponse(200, result, "Images fetched successfully."));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, [], "An error occurred while fetching images.")
      );
  }
};

const getSavedImage = async (req, res) => {
  const user = req.user;
  const { skip = 0, limit = 10 } = req.query;

  if (!user) {
    return res
      .status(401)
      .json(new ApiError(401, "Unauthorized", "You are not logged in"));
  }

  try {
    const userData = await User.findById(user._id).select("savedImage").lean();

    const savedImages = userData?.savedImage || [];

    if (savedImages.length === 0) {
      return res
        .status(404)
        .json(
          new ApiResponse(404, [], "No saved images found. Try saving one.")
        );
    }

    const paginatedImageIds = savedImages.slice(
      Number(skip),
      Number(skip) + Number(limit)
    );

    const result = await Promise.all(
      paginatedImageIds.map(async (id) => {
        const image = await Image.findById(id)
          .select("cloudinary_publicId _id uploadedBy")
          .lean();

        if (!image) return null;

        const isLiked = await Like.countDocuments({
          image: image._id,
          likedBy: user._id,
        });

        return {
          ...image,
          isLiked: isLiked > 0,
          isSaved: true,
        };
      })
    );

    const filteredResult = result.filter((img) => img !== null);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          filteredResult,
          "Saved images fetched successfully."
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Internal Server Error",
          "Something went wrong while fetching saved images."
        )
      );
  }
};

// deleting an image uploaded by the user
const deleteImage = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const imgId = req.params.imgId;

    if (!imgId) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json(new ApiResponse(400, [], "Image ID can't be null"));
    }

    const image = await Image.findById(imgId).session(session);
    if (!image) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json(new ApiResponse(404, [], "Image not found"));
    }

    await Like.deleteMany({ image: imgId }).session(session);

    await User.updateMany({}, { $pull: { savedImage: imgId } }).session(
      session
    );

    await cloudinary.uploader.destroy(image.cloudinary_publicId);

    const deletedImage = await Image.deleteOne({ _id: imgId }).session(session);
    if (deletedImage.deletedCount === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json(new ApiResponse(404, [], "Image not found"));
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(
        new ApiResponse(200, [], "Image and related likes deleted successfully")
      );
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json(new ApiError(500, "Error while deleting the image", error.message));
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

// getting account detail of someone
const getAccountDetails = async (req, res) => {
  try {
    const id = req.user._id;

    if (!id) {
      return res
        .status(400)
        .json(new ApiResponse(401, [], "Unauthorized user"));
    }
    console.log(id);

    const user = await User.findById(id)
      .lean()
      .select("fullname profileImg savedImage email bio");
    if (!user) {
      return res.status(404).json(new ApiResponse(404, [], "User not found"));
    }

    const totalFollowers = await Follow.countDocuments({ following: id });
    const totalFollowing = await Follow.countDocuments({ follower: id });

    const totalUploadsCount = await Image.countDocuments({ uploadedBy: id });
    const totalSavedImage = user.savedImage.length;

    const result = {
      email: user.email,
      fullname: user.fullname,
      profileImg: user.profileImg || null,
      bio: user.bio,
      totalFollowers,
      totalFollowing,
      totalUploadsCount,
      totalSavedImage,
    };

    return res
      .status(200)
      .json(new ApiResponse(200, result, "User details fetched successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong", error));
  }
};

// user is follow/unfollow someone
const toggleFollow = async (req, res) => {
  const userId = req.user._id;
  const toBeFollowedId = req.params.idTobeFollowed;

  if (!toBeFollowedId) {
    return res.status(400).json(new ApiResponse(400, [], "Id can't be null"));
  }

  if (userId.toString() === toBeFollowedId) {
    return res
      .status(400)
      .json(new ApiResponse(400, [], "You cannot follow yourself"));
  }

  try {
    const existingFollow = await Follow.findOne({
      follower: userId,
      following: toBeFollowedId,
    });

    if (existingFollow) {
      await Follow.deleteOne({
        follower: userId,
        following: toBeFollowedId,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, [], "Unfollowed successfully"));
    } else {
      await Follow.create({
        follower: userId,
        following: toBeFollowedId,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, [], "Followed successfully"));
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong", error.message));
  }
};

// user is like/unlike an image

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

const logoutUser = async (req, res) => {
  const id = req.user?._id;
  console.log(req.user);
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

const updateUser = async (req, res) => {
  const file = req.file;
  const { fullname, bio } = req.body;
  const id = req.user._id;
  if (!id) {
    return res.status(400).json(new ApiResponse(400, [], "Id can't be null"));
  }
  try {
    let upload;
    if (file) {
      const filePath = file.path;
      upload = await uploadFile(filePath);
    }
    const prevUser = await User.findById(id);
    const profileImg = prevUser.profileImg;
    if (profileImg) {
      await cloudinary.uploader.destroy(profileImg);
    }
    const updateduser = await User.findByIdAndUpdate(
      id,
      { fullname, bio, profileImg: upload?.public_id },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json(new ApiResponse(200, updateduser, "User updated successfully"));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "Something went wrong updating the user profile",
          error
        )
      );
  }
};

export {
  logoutUser,
  signUp,
  loginUser,
  getUploads,
  addImage,
  editImage,
  getAccountDetails,
  toggleFollow,
  deleteAccount,
  getSavedImage,
  updateUser,
  deleteImage,
};
