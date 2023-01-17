import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.set("strictQuery", true);

// function to close the MongoDB connection
async function dbClose() {
  await mongoose.connection.close();
  console.log("Database disconnected!");
}

// Connect to a MongoDB via Mongoose
try {
  const m = await mongoose.connect(process.env.ATLAS_DB_URL);
  console.log(
    m.connection.readyState === 1
      ? "Mongoose connected!"
      : "Mongoose failed to connect"
  );
} catch (err) {
  console.log(err);
}

// Export the models and the dbClose function
export { dbClose };
export default mongoose.connection;
