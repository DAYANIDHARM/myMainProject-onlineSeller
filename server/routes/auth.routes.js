const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/forgot-password/send-otp", authController.forgotPasswordSendOtp);
router.post("/forgot-password/verify-otp", authController.forgotPasswordVerifyOtp);
router.post("/forgot-password/reset", authController.resetPassword);

module.exports = router;
