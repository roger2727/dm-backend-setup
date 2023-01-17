import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// Create a new user
router.post("/register", async (req, res) => {
  console.log(req.body);

  // Check if the required fields are present in the request body
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if the email is in the correct format
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email try again" });
  }

  // Check if the password meets certain requirements
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  try {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user object with the hashed password
    const newUser = { email, password: hashedPassword, username };

    // Insert the new user into the database
    const insertedUser = await UserModel.create(newUser);
    console.log(insertedUser);

    // Send the new user as the response
    res.status(201).json({ user: insertedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    // Retrieve the email and password from the request body
    const { email, password } = req.body;

    // Find the user with the matching email
    const user = await UserModel.findOne({ email });

    // If no user with the email was found, return a 401
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If the passwords do not match, return a 401
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Create a JWT token with the user's _id included
    const payload = { userId: user._id };
    console.log(payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the token and a message as the response
    res.json({ token, msg: "You have successfully logged in" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  console.log(req.body);
  try {
    // Find all users in the database
    const users = await UserModel.find();

    // Send the users as the response
    res.send({ users });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default router;
