import { Router } from "express";
import {
  getAllImage,
  getSearchedImage,
  deleteImage,
  deleteAll,
} from "../Controller/image.controller.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

const router = Router();
// router.use(verifyJWT);
router.route("/getImage").post(getSearchedImage);
router.route("/getAll").get(getAllImage);
router.route("/delete").delete(deleteAll);
router.route("/delete/img").delete(deleteImage);
export default router;
