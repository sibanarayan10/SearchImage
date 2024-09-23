import express,{ Router } from "express";
import { upload } from "../Middlewares/multer.middleware.js";
import { addVideo } from "../Controller/video.controller.js";

const router=Router();

router.route('/upload').post(upload.single("image"),addVideo);

 export default router
