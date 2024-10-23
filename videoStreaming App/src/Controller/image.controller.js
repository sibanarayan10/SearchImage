import { Image } from "../Models/image.model.js";
import { uploadFile } from "../Utils/cloudinary.js";
import redisClient from "../Connect/connectRedis.js"
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";




const getSearchedImage = async (req, res) => {

    const { desc } = req.body;
    console.log(desc)
    try {
        if (!desc) {
            return res.status(401).json(new ApiError(401, "All fields are requried"));
        }
        const image = await Image.aggregate([
            {

                $search: {
                    index: 'default',
                    text: {
                        query: desc,
                        path: ['title', 'desc'],
                        fuzzy: { maxEdits: 2 },
                    },
                },

            }
        ])

     

        return res.status(200).json(new ApiResponse(200, image, "Image fetched successfully"));
} catch (error) {

        return res.status(500).json(new ApiError(500, "Server is not working properly for sometime", error));
    }

}
const getAllImage = async (req, res) => {
    try {
        const imgs = await Image.find();
        if (imgs.length == 0) {
            return res.status(500).json(new ApiError(500, "Website is under work!"));
        }

        return res.status(200).json(new ApiResponse(200, imgs, "All image fetched successfully"));

    } catch (error) {

        return res.status(500).json(new ApiResponse(500, "Error occur while retrieving image from the Db:", error));
    }
}
const deleteImage = async () => {

}

export { getSearchedImage, getAllImage, deleteImage }