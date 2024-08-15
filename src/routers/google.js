const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google/error" }),
  (req, res) => {
    // Extract token from user object
    const token = req.user.token;
    res.redirect(`http://localhost:3000/oauth-callback/${token}`);
  }
);

router.get("/api/user", (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    } else {
      const userData = decoded.userInfo;
      res.json(userData);
    }
  });
});

module.exports = router;
