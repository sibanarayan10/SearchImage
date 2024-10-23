import { Router } from "express";
import { getAllImage, getSearchedImage,deleteImage} from "../Controller/image.controller.js";
import {upload} from "../Middlewares/multer.middleware.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

// in this router we are handling the request for getting all the image, that may be owned by user mayn't be owned by the user

const router=Router();
// router.use(verifyJWT);
router.route('/getImage').post(getSearchedImage);
router.route('/getAll').get(getAllImage);
router.route('/delete/img').delete(deleteImage);
export default router;
