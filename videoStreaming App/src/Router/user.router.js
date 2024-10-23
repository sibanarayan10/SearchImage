import { Router } from "express";
import { redirectURL,oauthCallback,SignUp,loginUser, getAllImage,addImage,deleteAll,deleteUsers} from "../Controller/user.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";


// Over this router we are handling
/**
 * user authentication
 * get user uploaded photo / upload user owned photo
 * user google authentication
 * 
 */
const router=Router();
router.route('/SignUp').post(SignUp);
router.route('/Login').post(loginUser);

router.route('/addImage').post(upload.single("Image"),verifyJWT,addImage);
router.route('/signUp_google').get(redirectURL);
router.route('/oauthcallback').get(oauthCallback);
router.route('/getImages').get(verifyJWT,getAllImage);
router.route('/delete').delete(deleteUsers);
router.route('/deleteAll').delete(deleteAll);
// router.route('/:userid/getImage').get(verifyJWT,getAllImage);
// router.route('/:userId/updateProfile').post(verifyJWT,updateProfile);
// router.route('/:userid/deleteImage').delete(verifyJWT,deleteImage);

export default router;

