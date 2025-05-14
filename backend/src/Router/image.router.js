import { Router } from "express";
import {
  getAllImage,
  getSearchedImage,
  deleteAll,
  toggleLike,
  toggleSaveImage,
  getImageDetail,
} from "../Controller/Image.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { optionalJWT } from "../Middlewares/optional.middleware.js";

const router = Router();
// router.use(verifyJWT);
router.route("/search").get(optionalJWT, getSearchedImage);
router.get("/", optionalJWT, getAllImage);
router.route("/delete").delete(deleteAll);
router.use("/action", verifyJWT);
router.route("/action/like/:id").post(toggleLike);
router.route("/action/save/:id").post(toggleSaveImage);
router.route("/detail/:id").get(verifyJWT, getImageDetail);

export default router;
