import express from "express";
import { RecipeModel } from "../models/recipe.js";
import authenticateJWT from "../middleware/jwt-auth.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
// console.log(process.env.JWT_SECRET);
const router = express.Router();

// GETS ALL USERS RECIPES
router.get("/all", authenticateJWT, async (req, res) => {
  try {
    //Find all recipes created by the current user
    const recipes = await RecipeModel.find({ user: req.user.userId });
    // Send the recipes as the response
    res.json({ recipes });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/all", authenticateJWT, async (req, res) => {
  try {
    //Find all recipes created by the current user
    const recipes = await RecipeModel.find({ user: req.user.userId });
    // Send the recipes as the response
    res.json({ recipes });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/add", authenticateJWT, async (req, res) => {
  const {
    title,
    ingredients,
    instructions,
    cookingTime,
    servingSize,
    rating,
    vegetarian,
  } = req.body;
  try {
    // Check if a recipe with the same title and user already exists in the database
    const existingRecipe = await RecipeModel.findOne({
      title: title,
      user: req.user.userId,
    });
    if (existingRecipe) {
      return res.status(400).json({
        error: "A recipe with the same title already exists for this user",
      });
    }

    const newRecipe = {
      title,
      ingredients,
      instructions,
      cookingTime,
      servingSize,
      rating,
      vegetarian,
      user: req.user.userId,
    };

    // Insert the new recipe into the database
    const insertedRecipe = await RecipeModel.create(newRecipe);

    // Send the new recipe as the response
    res.status(201).json({ recipe: insertedRecipe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//SEARCH USERS RECIPES FOR SPECIFIC INGREDIENTS
router.get("/search-ingredents", authenticateJWT, async (req, res) => {
  try {
    // Get the ingredients from the query parameters
    const ingredients = JSON.parse(req.query.ingredients);
    // Find all recipes that contain the ingredients
    const recipes = await RecipeModel.find({
      ingredients: { $in: ingredients },
      user: req.user.userId,
    });
    // Send the recipes as the response
    res.json({ recipes });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err.message });
  }
});
//Delet
router.delete("/delete/:recipeId", authenticateJWT, async (req, res) => {
  try {
    // Check if the recipeId in the params is a valid ObjectId
    const isValid = mongoose.Types.ObjectId.isValid(req.params.recipeId);
    if (!isValid) {
      return res.status(500).json({ error: "Invalid recipe id" });
    }

    // Find and delete the recipe that belongs to the current user and has the specified recipeId
    const recipe = await RecipeModel.findOneAndDelete({
      _id: req.params.recipeId,
      user: req.user.userId,
    });

    // If no recipe is found, return a 404 error
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Send a success message as the response
    res.json({ message: "Recipe successfully deleted" });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err.message });
  }
});
router.patch("/update/:recipeId", authenticateJWT, async (req, res) => {
  try {
    // Find the recipe by its ID and the current user's ID
    const recipe = await RecipeModel.findOne({
      _id: req.params.recipeId,
      user: req.user.userId,
    });

    // If the recipe is not found, return a 404 status code
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }

    // Update the recipe with the new data from the request body
    recipe.title = req.body.title;
    recipe.ingredients = req.body.ingredients;
    recipe.instructions = req.body.instructions;
    recipe.image = req.body.image;
    recipe.cookingTime = req.body.cookingTime;
    recipe.servingSize = req.body.servingSize;
    recipe.rating = req.body.rating;
    recipe.vegetarian = req.body.vegetarian;

    // Save the updated recipe
    await recipe.save();

    // Send the updated recipe as the response
    res.json({ recipe });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
