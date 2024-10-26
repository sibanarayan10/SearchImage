import { Router } from "express";
import {
  redirectURL,
  oauthCallback,
  SignUp,
  loginUser,
  getAllImage,
  addImage,
  deleteAll,
  deleteUsers,
  deleteImage,
  editImage,
  getallUsers
} from "../Controller/user.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router = Router();

// User authentication routes
router.route('/signup').post(SignUp);
router.route('/login').post(loginUser);
// Google OAuth routes
router.route('/google/signup').get(redirectURL);
router.route('/oauthcallback').get(oauthCallback);

// User data routes
router.route('/users').get(getallUsers);
router.use('/images',verifyJWT);
router.route('/images').get(getAllImage);

// Image upload and modification
router.route('/images').post(upload.single("Image"), addImage);
router.route('/images/:id').put(editImage);
router.route('/images/:imgId').delete(deleteImage);


// Admin or mass delete routes
router.route('/deleteAll').delete(deleteAll);

// Optional routes for further usage
// router.route('/users/:userid/getImage').get(verifyJWT, getAllImage);
// router.route('/users/:userId/updateProfile').post(verifyJWT, updateProfile);
// router.route('/users/:userid/deleteImage').delete(verifyJWT, deleteImage);

export default router;