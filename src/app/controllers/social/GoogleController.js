const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const googleAuth = require("../../../services/authDal");

const configLoginWithGoogle = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_APP_REDIRECT_LOGIN,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Checking google: ", profile);
        const { failure, success } = await googleAuth.registerWithGoogle(
          profile
        );
        const user = failure || success;
        if (user) {
          console.log(
            failure
              ? "Google user already exists in DB.."
              : "Google user registered successfully.",
            user
          );
          const token = jwt.sign(
            { userInfo: user.data },
            process.env.JWT_ACCESS_TOKEN,
            { expiresIn: "1h" }
          );
          user.token = token;
          return done(null, user);
        }

        return done(new Error("Unknown error during Google authentication"));
      }
    )
  );

  passport.serializeUser(function (user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
  });
};

module.exports = configLoginWithGoogle;
