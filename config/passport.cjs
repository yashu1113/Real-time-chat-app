console.log("GOOGLE_CLIENT_ID at passport load:", process.env.GOOGLE_CLIENT_ID);

const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
let User;
import("../backend/features/users/user.model.js")
  .then((module) => {
    User = module.default;
  })
  .catch((err) => {
    console.error("Failed to load User model:", err);
    process.exit(1);
  });

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

/**
 * Google OAuth 2.0 Strategy Configuration
 * Handles Google authentication and user creation/merging
 */
passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Validate required profile data
        if (!profile?.id || !profile?.emails?.[0]?.value) {
          throw new Error("Incomplete Google profile data");
        }

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            fullName: profile.displayName || "Google User",
            username: profile.emails[0].value.split("@")[0],
            email: profile.emails[0].value,
            profilePic: profile.photos?.[0]?.value || "",
            provider: "google",
            verified: true,
          });
        } else if (!user.googleId) {
          // Merge existing local account with Google
          user.googleId = profile.id;
          user.provider = "google";
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        console.error("Google auth error:", err);
        return done(err, null);
      }
    }
  )
);
