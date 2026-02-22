import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../users/user.model.js";
import generateToken from "../../shared/utils/generate-token.js";
import { errorResponse } from "../../shared/utils/error-response.js";
import { asyncHandler } from "../../shared/utils/async-handler.js";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

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

/**
 * Handle initial redirect to Google
 */
export const getGoogleAuthUrl = (req, res) => {
  const url = googleClient.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    client_id: process.env.GOOGLE_CLIENT_ID,
  });
  res.redirect(url);
};

/**
 * Handle Google callback and issue token (for redirect flow)
 */
export const handleGoogleCallback = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) {
    console.error("No code provided in Google callback");
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
  }

  try {
    // Ensure the client has the credentials (in case they weren't loaded at start)
    if (!googleClient._clientId) {
      googleClient._clientId = process.env.GOOGLE_CLIENT_ID;
      googleClient._clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      googleClient.redirectUri = process.env.GOOGLE_CALLBACK_URL;
    }

    console.log("Exchanging code for tokens...");
    console.log("Using Client ID (first 10 chars):", process.env.GOOGLE_CLIENT_ID?.substring(0, 10));

    // Exchange code for tokens
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    });

    const idToken = tokens.id_token;

    if (!idToken) {
      throw new Error("No id_token returned from Google");
    }

    // Verify the id_token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const avatar = payload.picture || "";

    // Find or create user
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: "google",
        avatar,
        isEmailVerified: true,
      });
    } else {
        if (!user.googleId) user.googleId = googleId;
        user.authProvider = "google";
        if (avatar && !user.avatar) user.avatar = avatar;
        await user.save();
    }

    const token = generateToken(user._id);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    console.log("Google Auth Success for user:", user.email);

    // Redirect to frontend with token in URL
    res.redirect(`${frontendUrl}?token=${token}`);
  } catch (error) {
    console.error("Manual Google Callback Error:", error.message);
    if (error.response?.data) {
      console.error("Google API Response Error:", error.response.data);
    }
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
});

export const getMe = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

