const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
  type: String,
  trim: true,
  minlength: 3,
  required: false
},
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
  type: String,
  minlength: 6,
  required: false
},
    emailVerified: { type: Boolean, default: false },
otp: { type: String },
otpExpires: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
