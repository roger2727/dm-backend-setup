import mongoose from "mongoose";
import mongooseConnection from "../db.js";

// Mongoose schema for a user model,
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
});
const UserModel = mongooseConnection.model("User", userSchema);

export { UserModel };
