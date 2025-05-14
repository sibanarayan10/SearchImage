import { Router } from "express";
import {
  loginUser,
  addImage,
  editImage,
  logoutUser,
  signUp,
  toggleFollow,
  getAccountDetails,
  deleteAccount,
  getUploads,
  getSavedImage,
  updateUser,
  deleteImage,
} from "../Controller/User.controller.js";

import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router = Router();

router.route("/sign-up").post(signUp);
router.route("/sign-in").post(loginUser);

// router.route("/google/signup").get(redirectURL);
// router.route("/oauthcallback").get(oauthCallback);

router.route("/log-out").post(verifyJWT, logoutUser);

router.route("/addImages").post(verifyJWT, upload.array("images"), addImage);

router.route("/follow/:idTobeFollowed").post(verifyJWT, toggleFollow);
router.route("/profile").get(verifyJWT, getAccountDetails);
router.route("/delete/:id").delete(deleteAccount);
router.route("/uploads").get(verifyJWT, getUploads);
router.route("/saved").get(verifyJWT, getSavedImage);
router
  .route("/profile/update")
  .post(verifyJWT, upload.single("profileImage"), updateUser);
router.route("/uploads/image/:imgId").post(verifyJWT, deleteImage);

export default router;
