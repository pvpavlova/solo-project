const express = require("express");
const authRouter = express.Router();
const { User } = require("../../db/models");
const generateTokens = require("../../utils/generateToken");
const cookieConfig = require("../../configs/cookieConfig");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  const { email, user_name, password } = req.body;
  const hashpass = await bcrypt.hash(password, 10);
  const [newUser, created] = await User.findOrCreate({
    where: { email },
    defaults: { user_name, password: hashpass },
  });
  if (!created) {
    return res.status(400).json({ text: "Почта уже используется" });
  }

  const user = newUser.get();
  delete user.password;
  const { refreshToken, accessToken } = generateTokens({ user });
  res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieConfig)
    .json({ user, accessToken });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const targetUser = await User.findOne({ where: { email } });

    if (!targetUser) {
      return res.status(400).json({ text: "Неверный email" });
    }

    const isValid = await bcrypt.compare(password, targetUser.password);
    if (!isValid) {
      return res.status(400).json({ text: "Неверный пароль" });
    }

    const user = targetUser.get();
    delete user.password;

    const { refreshToken, accessToken } = generateTokens({ user });

    res
      .status(200)
      .cookie("refreshToken", refreshToken, cookieConfig)
      .json({ user, accessToken });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ text: "Произошла ошибка при входе" });
  }
});

authRouter.get("/logout", (req, res) => {
  res.clearCookie("refreshToken").status(200).send("Logout successful!");
});

module.exports = authRouter;
