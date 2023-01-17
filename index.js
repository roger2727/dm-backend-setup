import express from "express";
import recipeRoutes from "./routes/recipe-routes.js";
import authRoutes from "./routes/auth-routes.js";

import cors from "cors";

const app = express();
const port = 4001;

// Enable CORS
app.use(cors());

// Parse incoming JSON data
app.use(express.json());

// Root route
app.get("/", (request, response) => response.send({ info: "dinner mate" }));

// users routes
app.use("/auth", authRoutes);
app.use("/recipe", recipeRoutes);

app.listen(port, () => console.log(`App running at http://localhost:${port}/`));
