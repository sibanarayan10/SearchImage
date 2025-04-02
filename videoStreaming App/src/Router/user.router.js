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
  getallUsers,
  getUserDetail,
  logoutUser,
} from "../Controller/user.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router = Router();

router.route("/signup").post(SignUp);
router.route("/login").post(loginUser);

router.route("/google/signup").get(redirectURL);
router.route("/oauthcallback").get(oauthCallback);

router.route("/users").get(getallUsers);
router.route("/log-out").get(verifyJWT, logoutUser);
router.use("/images", verifyJWT);
router.route("/images").get(getAllImage);

router.route("/images").post(upload.single("Image"), addImage);
router.route("/images/:id").put(editImage);
router.route("/images/:imgId").delete(deleteImage);
router.route("/images/details/:id").get(getUserDetail);

router.route("/deleteAll").delete(deleteAll);

export default router;
