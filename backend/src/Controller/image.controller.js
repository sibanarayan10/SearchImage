import { Image } from "../Models/image.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Like } from "../Models/Like.model.js";
import { User } from "../Models/user.model.js";
import { Follow } from "../Models/Follow.model.js";

const getSearchedImage = async (req, res) => {
  const { limit = 10, skip = 0, search } = req.query;
  const user = req.user;

  if (!search || search.trim() === "") {
    return res
      .status(400)
      .json(new ApiError(400, "Please enter a search query"));
  }

  try {
    const images = await Image.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: search,
            path: ["title", "desc", "tags"],
            fuzzy: { maxEdits: 2 },
          },
        },
      },
      { $skip: parseInt(skip) },
      { $limit: parseInt(limit) },
      {
        $project: {
          _id: 1,
          cloudinary_publicId: 1,
        },
      },
    ]);

    if (!images.length) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No matching images found"));
    }

    if (user) {
      const currUser = await User.findById(user._id)
        .select("savedImage")
        .lean();

      const enriched = await Promise.all(
        images.map(async (image) => {
          const isLiked = await Like.exists({
            image: image._id,
            likedBy: user._id,
          });

          const isSaved = currUser.savedImage.some(
            (imgId) => imgId.toString() === image._id.toString()
          );

          return {
            _id: image._id,
            cloudinary_publicId: image.cloudinary_publicId,
            isLiked: !!isLiked,
            isSaved,
          };
        })
      );

      return res
        .status(200)
        .json(new ApiResponse(200, enriched, "Images fetched with user flags"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, images, "Images fetched successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Server error occurred", error.message));
  }
};

const getAllImage = async (req, res) => {
  const queryParams = req.query;
  const limit = Number.parseInt(queryParams.limit) || 10;
  const skip = Number.parseInt(queryParams.skip) || 0;
  const user = req.user; // Optional JWT middleware sets this

  try {
    const images = await Image.find()
      .skip(skip)
      .limit(limit)
      .select("cloudinary_publicId _id")
      .lean();

    if (!images.length) {
      return res.status(200).json(new ApiResponse(200, [], "Upload a photo!"));
    }

    if (user) {
      const currUser = await User.findById(user._id)
        .select("savedImage")
        .lean();

      const result = await Promise.all(
        images.map(async (image) => {
          const isLiked = await Like.exists({
            image: image._id,
            likedBy: user._id,
          });

          const isSaved = currUser.savedImage.some(
            (imgId) => imgId.toString() === image._id.toString()
          );

          return {
            ...image,
            isLiked: !!isLiked,
            isSaved,
          };
        })
      );

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            result,
            "All images fetched successfully with user preferences"
          )
        );
    }

    // No user – return base image list
    return res
      .status(200)
      .json(new ApiResponse(200, images, "All images fetched successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Error occurred while retrieving images from the database",
          error.message
        )
      );
  }
};

const getImageDetail = async (req, res) => {
  const imgId = req.params.id;
  if (!imgId) {
    return res.status(400).json(new ApiResponse(400, [], "Id can't be null"));
  }
  const user = req.user;
  if (!user) {
    return res.status(401).json(new ApiResponse(401, [], "Unauthorized"));
  }
  const userData = await User.findOne({ _id: user._id }).lean();
  try {
    const image = await Image.findOne({ _id: imgId }).lean();
    let liked = null,
      uploader = null,
      follow = null,
      totalLike = 0;
    if (user) {
      [liked, uploader, follow, totalLike] = await Promise.all([
        Like.findOne({ image: image._id, likedBy: user._id }).lean(),

        User.findOne({ _id: image.uploadedBy }).lean(),
        Follow.findOne({
          follower: user._id,
          following: image.uploadedBy,
        }).lean(),
        Like.countDocuments({ image: image._id }),
      ]);
    } else {
      uploader = await User.findOne({ _id: image.uploadedBy }).lean();
    }

    const result = {
      isLiked: !!liked,
      isSaved:
        userData?.savedImage?.some((id) => id.toString() == imgId.toString()) ||
        false,
      isFollowing: !!follow,
      totalLike: totalLike,
      ownerId: uploader._id,
      uploadedBy: uploader.fullname || null,
    };
    console.log(userData);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          result,
          "All images fetched successfully in random order"
        )
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          "Error occurred while retrieving images from the database",
          error.message
        )
      );
  }
};
const deleteAll = async (req, res) => {
  try {
    const count = await Image.deleteMany();
    console.log(count);
    return res
      .status(200)
      .json(new ApiResponse(200, "file deleted successfully"));
  } catch (error) {
    return res.status(500).json(new ApiError(500, "database error", error));
  }
};
const toggleLike = async (req, res) => {
  const userId = req.user._id;
  const imgId = req.params.id;

  if (!imgId) {
    return res
      .status(400)
      .json(new ApiResponse(400, [], "Image ID can't be null"));
  }

  try {
    const existingLike = await Like.findOne({
      image: imgId,
      likedBy: userId,
    });

    if (existingLike) {
      // Unlike
      await Like.deleteOne({
        image: imgId,
        likedBy: userId,
      });

      return res.status(200).json(new ApiResponse(200, [], "Image unliked!"));
    } else {
      // Like
      await Like.create({
        image: imgId,
        likedBy: userId,
      });

      return res.status(200).json(new ApiResponse(200, [], "Image liked!"));
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong", error.message));
  }
};
const toggleSaveImage = async (req, res) => {
  const userId = req.user._id;
  const imageId = req.params.id;

  if (!imageId) {
    return res
      .status(400)
      .json(new ApiResponse(400, [], "Image ID can't be null"));
  }

  try {
    const user = await User.findById(userId).select("savedImage");
    if (!user) {
      return res.status(404).json(new ApiResponse(404, [], "User not found"));
    }

    const alreadySaved = user.savedImage.includes(imageId);

    if (alreadySaved) {
      user.savedImage.pull(imageId);
      await user.save();
      return res.status(200).json(new ApiResponse(200, [], "Image unsaved."));
    } else {
      user.savedImage.push(imageId);
      await user.save();
      return res.status(200).json(new ApiResponse(200, [], "Image saved."));
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong", error.message));
  }
};

export {
  getSearchedImage,
  getAllImage,
  deleteAll,
  toggleLike,
  toggleSaveImage,
  getImageDetail,
};
