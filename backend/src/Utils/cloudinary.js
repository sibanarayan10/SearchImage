import cloudinary from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (filePath) => {
  if (!filePath) {
    throw new Error("filepath is required");
  }
  try {
    const result = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    console.error("Error uploading file:", error);
    fs.unlinkSync(filePath);
  }
};
export { uploadFile };
