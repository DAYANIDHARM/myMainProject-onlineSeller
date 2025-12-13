const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

/* ================= EMAIL TRANSPORT ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= SEND OTP ================= */
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    // ✅ FIND USER FIRST
    let user = await User.findOne({ email });

    // ✅ OTP COOLDOWN CHECK
    if (user && user.otpExpires && user.otpExpires > Date.now()) {
      return res.status(400).json({
        message: "OTP already sent. Please wait ❌",
      });
    }

    // ✅ GENERATE OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // ✅ CREATE TEMP USER IF NOT EXISTS
    if (!user) {
      user = new User({ email });
    }

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // ✅ SEND EMAIL
    await transporter.sendMail({
      from: `"Veera Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Email Verification OTP",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    res.json({
      success: true,
      message: "OTP sent successfully ✅",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP ❌" });
  }
};


/* ================= VERIFY OTP ================= */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ message: "User not found ❌" });

    if (
      user.otp !== otp ||
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP ❌" });
    }

    user.emailVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({
  success: true,
  message: "Email verified successfully ✅"
});

  } catch (error) {
    res.status(500).json({ message: "OTP verification failed ❌" });
  }
};

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Please verify email first" });

    if (!user.emailVerified)
      return res.status(400).json({
        message: "Email not verified ❌",
      });

    if (user.username && user.password) {
  return res.status(400).json({ message: "User already exists ❌" });
}


    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.username = username;
    user.password = hashedPassword;
    await user.save();

    res.status(201).json({
      message: "Registration successful ✅",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials ❌" });

    if (!user.emailVerified)
      return res.status(403).json({
        message: "Please verify your email first ❌",
      });

    if (!user.password)
      return res.status(400).json({
        message: "Please complete registration first ❌",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials ❌" });

    const token = jwt.sign(
      { id: user._id },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    res.json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
};


exports.forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found ❌" });

    const otp = crypto.randomInt(100000, 999999).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: `"Veera Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes</p>
      `,
    });

    res.json({ success: true, message: "OTP sent ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error ❌" });
  }
};

exports.forgotPasswordVerifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (
    !user ||
    user.otp !== otp ||
    !user.otpExpires ||
    user.otpExpires < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid OTP ❌" });
  }

  res.json({ success: true });
};

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found ❌" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  user.otp = null;
  user.otpExpires = null;

  await user.save();

  res.json({ success: true, message: "Password updated ✅" });
};

