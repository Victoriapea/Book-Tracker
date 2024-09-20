import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = (req, res) => {
  const { username, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      return newUser.save();
    })
    .then((savedUser) => {
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
      res.status(201).json({
        token,
        user: {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
        },
      });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

export const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: "L'utilisateur n'existe pas" });
      }

      return bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res.status(400).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
        });
      });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};
