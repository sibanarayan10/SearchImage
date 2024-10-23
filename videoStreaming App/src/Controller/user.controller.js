import { User } from "../Models/user.model.js";
import { oauth2Client } from "../Utils/googleAuth.js";

import { uploadFile } from "../Utils/cloudinary.js";
import { Image } from "../Models/image.model.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import { ObjectId } from "mongoose";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    console.log("error happen at :")
    throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}
const SignUp = async (req, res) => {
  // Extract form data and file
  const { FirstName, LastName, PhoneNumber, Password, confirmPassword, Email } = req.body;
try {
    // Validate fields
    if ([FirstName, LastName, PhoneNumber, Password, confirmPassword, Email].some(item => !item.trim())) {
      return res.status(400).json(new ApiError(400, "All fields are required!"));
    }

    const userExist = await User.findOne({ Email });

    if (userExist) {
      return res.status(402).json(new ApiError(402, "User Already exist with this Email!Try with another"));
    }
    if (Password !== confirmPassword) {
      return res.status(400).json(new ApiError(400, "Password mismatched!"));
    }

    /** Validate file upload */

    // if (!file) {
    //   return res.status(400).json({ message: "File not uploaded successfully!" });
    // }

    /**Upload file */
    // const filePath = file.path;
    // const uploadResponse = await uploadFile(filePath);
    // console.log(uploadResponse);

    // Create user
    const user = new User({
      FirstName, LastName, PhoneNumber, Password, confirmPassword, Email

      // Assuming uploadFile returns an object with asset_id
    });

    // Save user to database
    await user.save();

    // Respond with success
    return res.status(201).json(new ApiResponse(200, "Sign-Up successfully"));
  } catch (error) {

    return res.status(500).json(new ApiError(500, "Server is not responding for some reason.Try after some time", error));
  }
};


const loginUser = async (req, res) => {
  const { Email, Password } = req.body;
  console.log(Email,Password);
  console.log(typeof Password);

  try {
    if (!Email || !Password) {
      throw new ApiError(400, "Username or password is required");
    }
    const user = await User.findOne({ Email });
    console.log(user);
    if (!user) {
      throw new ApiError(404, "User does not exist!,Please Sign up to create an Account");
    }
    const isPasswordValid = await user.isPasswordCorrect(Password);
    if (!isPasswordValid) {
      return res.status(400).json(new ApiError(400, "Password for this email is incorrect!"));
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-Password -refreshToken");

    if (!loggedInUser) {
      return res.status(402).json(new ApiResponse(402, "user not authenticated!"));
    }
    const options = {
      httpOnly: true,
      // Use secure in production

      // 1 day
    };

    // Set cookies and return response

    // console.log("hii")
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
  } catch (error) {
    // Properly handle and send error to the client

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    } else {
      return res.status(500).json(new ApiError(500, "An unexpected error occurred", error.message));
    }
  }
};
const updateProfile = async (req, res) => {

}
const redirectURL = async (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/userinfo.profile'],
  });

  res.redirect(authUrl);
}

/**in this google authentication what we are doing is if the user is previously logged in the google, we are just fetching that data instead of authentcating the user again,
 * As during the authentication google is providing us with some refreshtoken and accesstoken, instead of creating again the accesstoken and refresh token what we are doing is we setting cookie for accesstoken and refresh token and by keeping the data, we are also manipulating the req object.
 */
const oauthCallback = async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(500).json({ error: "Google authentication failed!" });
  }

  try {
    // Exchange the authorization code for an access token and refresh token
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Access Token and Refresh Tokens:", tokens);

    // Set the credentials on the OAuth2 client
    oauth2Client.setCredentials(tokens);

    // Fetch the user's profile information from Google
    const userInfoResponse = await oauth2Client.request({
      url: 'https://www.googleapis.com/userinfo/v2/me',
    });

   
    console.log("User Info:", userInfoResponse);
    const userData=userInfoResponse.data;
    const userId=userData.id;
    const accessToken=jwt.sign({
      _id:new ObjectId(userId),

      FirstName:userData.given_name,
      LastName:userData.family_name,
      Email:userData.email,
      googleAuthenticated:true,
    },process.env.ACCESS_TOKEN_SECRET,{
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
    const refreshToken=jwt.sign({
      _id:new ObjectId(userId),
      FirstName:userData.given_name,
      LastName:userData.Family_name,
      Email:userData.email
    },process.env.REFRESH_TOKEN_SECRET,{
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })

    // Optionally, save the user info and tokens in your database here
    // You can add user creation or update logic based on userInfo.email or other properties

    // Set cookies for access token and refresh token
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Helps mitigate the risk of client-side script accessing the protected cookie
 // Use secure cookies in production
      maxAge: 3600 * 24000, // 1 day expiration
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    
      maxAge: 30 * 24 * 3600 * 1000, // 30 days expiration
    });

    // Redirect to the frontend application
    return res.redirect("http://localhost:5173/"); // Change to your frontend URL if different
  } catch (error) {
    console.error('Error during authentication:', error.message);
    return res.status(500).send('Authentication failed');
  }
};

const getAllImage = async (req, res) => {
  try {
    const user = req.user;
// console.log(user);
    if (!user) {
      return res.status(401).json(new ApiResponse(401, null, "User not Authenticated!"));
    }

    const img = await Image.find({ owner: user._id });

    if (img.length === 0) {
      return res.status(404).json(new ApiResponse(404, null, "No images found. Please upload an image."));
    }

    return res.status(200).json(new ApiResponse(200, img, "Images fetched successfully."));
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json(new ApiResponse(500, null, "An error occurred while fetching images."));
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
      return res.status(500).json({ error: "Something went wrong while saving the file locally." });
    }

    const upload = await uploadFile(localImagePath);
    console.log(upload)
    const image = new Image({
      Title,
      Description,
      owner: req.user._id,
      cloudinary_Assetid: upload.asset_id,
      cloudinary_publicId: upload.public_id
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
  const img=await Image.find({owner:req.user});
  return img;


}
const deleteUsers = async (req, res) => {
  try {
    const result = await User.deleteMany(); // Deletes all documents in the User collection
    res.status(200).json({ message: 'All users deleted successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting users', error: error.message });
  }
};


export { redirectURL, oauthCallback, SignUp, loginUser, getAllImage, deleteAll, updateProfile, addImage,deleteUsers };