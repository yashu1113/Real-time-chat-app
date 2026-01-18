import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: false,
      unique: false,
    },
    password: {
      type: String,
      minlength: 6,
    },
    googleId: {
      type: String,
    },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    gender: {
      type: String,
      required: false,
      enum: ["male", "female", "other"],
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export default User;
