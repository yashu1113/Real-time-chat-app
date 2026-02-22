import mongoose from "mongoose";
import { generateCustomId } from "../../shared/utils/generate-custom-id.js";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      unique: true,
      index: true,
      immutable: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      sparse: true, // allows multiple null values (only one doc per googleId)
    },

    avatar: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.index({ googleId: 1 }, { sparse: true });

// Generate a custom user ID on first save
userSchema.pre("save", async function (next) {
  if (!this.userId) {
    this.userId = await generateCustomId("US");
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
