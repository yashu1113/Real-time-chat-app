import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../users/user.model.js";
import generateToken from "../../shared/utils/generate-token.js";
import { errorResponse } from "../../shared/utils/error-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

 
  if (!name || !email || !password) {
    return errorResponse(res, 400, "All fields are required");
  }


  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse(res, 400, "User already exists");
  }

  if (password.length < 6) {
    return errorResponse(res, 400, "Password must be at least 6 characters");
  }
 
  const hashedPassword = await bcrypt.hash(password, 10);

 
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    authProvider: "local",
  });

  res.status(201).json({
    success: true,
    message: "User created successfully. Please login.",
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

export default signup;



const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return errorResponse(res, 401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return errorResponse(res, 401, "Invalid credentials");
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export { login };

export const googleLogin = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return errorResponse(res, 400, "Google ID token is required");
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const avatar = payload.picture || "";

    let user = await User.findOne({ googleId });

    if (user) {
      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          authProvider: user.authProvider,
        },
      });
    }

    user = await User.findOne({ email });

    if (user) {
      user.googleId = googleId;
      user.authProvider = "google";
      if (avatar) user.avatar = avatar;
      await user.save();

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          authProvider: user.authProvider,
        },
      });
    }

    const newUser = await User.create({
      name,
      email,
      googleId,
      authProvider: "google",
      avatar,
      isEmailVerified: true,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        authProvider: newUser.authProvider,
      },
    });
  } catch (error) {
    console.error("Google token verification error:", error);
    return errorResponse(res, 401, "Invalid or expired Google token");
  }
});

export const getMe = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};


