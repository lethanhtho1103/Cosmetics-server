const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const validator = require("validator");
const storage = require("../../services/uploadImage");

let refreshTokens = [];
class AuthController {
  async register(req, res, next) {
    const upload = multer({ storage: storage }).single("avatar");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Lỗi tải lên tệp" });
      } else if (err) {
        return res.status(500).json({ error: "Lỗi tải lên tệp" });
      } else {
        try {
          const { username, email, password, address, phone } = req.body;
          const salt = await bcrypt.genSalt(10);
          const hashed = await bcrypt.hash(password, salt);
          const avatar = req.file ? req.file.originalname : null;
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            return res.status(400).json({ error: "The user already exists." });
          } else {
            const newUser = new User({
              username,
              email,
              password: hashed,
              address,
              phone,
              avatar,
              admin: false,
              type: "LOCAL",
            });
            const user = await newUser.save();
            const authController = new AuthController();
            const accessToken = authController.generateAccessToken(user);
            const refreshToken = authController.generateRefreshToken(user);
            res.cookie("refresh_token", refreshToken, {
              httpOnly: true,
              secure: false,
              path: "/",
            });
            return res.status(200).json({
              message: "Đăng ký thành công.",
              data: user,
              accessToken,
            });
          }
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    });
  }

  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: "30d" }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "365d" }
    );
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "invalid email format" });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(403).json({ error: "wrong email" });
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(403).json({ error: "wrong password" });
      }
      if (user && validPassword) {
        const authController = new AuthController();
        const accessToken = authController.generateAccessToken(user);
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.cookie("refresh_token", refreshToken, {
          httpOnly: true,
          secure: false,
          path: "/",
        });
        const { password, ...data } = user._doc;

        res
          .status(200)
          .json({ data, accessToken, message: "Đăng nhập thành công." });
      }
    } catch (error) {
      console.log(error);
    }
  }

  // REFRESH TOKEN
  async requestRefreshToken(req, res) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(403).json("You're not authenticated");
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh Token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      }
      refreshTokens = refreshTokens.filter(
        (token) => token !== req.cookies.refresh_token
      );
      // Create new accessToken and refreshToken
      const newAccessToken = AuthController.generateAccessToken(user);
      const newRefreshToken = AuthController.generateRefreshToken(user);
      refreshTokens.push(newRefreshToken);
      res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
      });
      res.status(200).json({ accessToken: newAccessToken });
    });
  }

  async logoutUser(req, res) {
    res.clearCookie("refresh_token");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies?.refresh_token
    );
    res.status(200).json("Log out successfully");
  }

  async updateUser(req, res) {
    const upload = multer({ storage: storage }).single("avatar");
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: "Lỗi tải lên tệp" });
      } else if (err) {
        return res.status(500).json({ error: "Lỗi tải lên tệp" });
      } else {
        try {
          const userId = req.params.id;
          const { username, email, password, address } = req.body;

          if (email && !validator.isEmail(email)) {
            return res
              .status(400)
              .json({ error: "Định dạng email không hợp lệ" });
          }

          const user = await User.findById(userId);
          if (!user) {
            return res.status(404).json({ error: "Người dùng không tồn tại" });
          }

          if (username) user.username = username;
          if (email) user.email = email;
          if (address) user.address = address;
          if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
          }
          if (req.file) user.avatar = req.file.originalname;

          const updatedUser = await user.save();
          return res.status(200).json({
            message: "Cập nhật thông tin người dùng thành công.",
            data: updatedUser,
          });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    });
  }
}

module.exports = new AuthController();
