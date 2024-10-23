import { Image } from "../Models/image.model.js";

import redisClient from "../Connect/connectRedis.js"
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";




const getSearchedImage = async (req, res) => {

    const { desc } = req.body;
    console.log(desc)
    try {
        if (!desc) {
            return res.status(401).json(new ApiError(401, "Search for something"));
        }
        const image = await Image.aggregate([
            {

                $search: {
                    index: 'default',
                    text: {
                        query: desc,
                        path: ['Title', 'Description'],
                        fuzzy: { maxEdits: 2 },
                    },
                },

            }
        ])
console.log(image);
     

        return res.status(200).json(new ApiResponse(200, image, "Image fetched successfully"));
} catch (error) {

        return res.status(500).json(new ApiError(500, "Server is not working properly for sometime", error));
    }

}
const getAllImage = async (req, res) => {
    try {
        const imgs = await Image.find();
        if (imgs.length === 0) {
            return res.status(200).json(new ApiResponse(200, "Upload a photo!"));
        }

       
        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const shuffledImgs = shuffleArray(imgs); 

        return res.status(200).json(new ApiResponse(200, shuffledImgs, "All images fetched successfully in random order"));

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Error occurred while retrieving images from the database:", error));
    }
};
const deleteImage = async () => {

}
const deleteAll=async(req,res)=>{
    try{
       const count=await Image.deleteMany();
       console.log(count);
       return res.status(200).json(new ApiResponse(200,"file deleted successfully"));
    }catch(error){
return res.status(500).json(new ApiError(500,"database error",error));
    }
}

export { getSearchedImage, getAllImage, deleteImage,deleteAll }