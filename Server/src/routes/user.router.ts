import { Router } from "express";
import {
    signUp,
    signIn,
    verifyOTP,
    signOut,
    sendOTP,
    changeCurrentPassword,
    updateAccountDetails,
    updateEmailUsingOTP,
    testing,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    signUp
);
router.route("/send-otp").post(sendOTP);
router.route("/verify-otp").post(upload.none(), verifyOTP);

router.route("/signin").post(upload.none(), signIn);

//testing route
router.route("/testing").post(verifyJWT, upload.none(), testing);

//secure routes
router.route("/signout").post(verifyJWT, signOut);

router
    .route("/change-password")
    .post(upload.none(), verifyJWT, changeCurrentPassword);

router.route("/update-profile").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    verifyJWT,
    updateAccountDetails
);

router
    .route("/update-email")
    .post(upload.none(), verifyJWT, updateEmailUsingOTP);

export default router;
