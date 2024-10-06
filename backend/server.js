import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";

const app = express();


dotenv.config();
console.log("MongoDB URI:", process.env.MONGODB_URI); 


const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());


const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
  })
  .then(async () => {
    console.log("Connected to MongoDB!");
    // await seedDatabase();
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });


// Import routes
import authRoutes from './routes/authRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import adviseRoutes from './routes/advisemeRoutes.js';
app.use('/auth', authRoutes);  
app.use('/media', mediaRoutes); 
app.use('/adviseme', adviseRoutes);


// Root route
app.get("/", (req, res) => {
  res.send("Hello world! Welcome to BookTrack!");
});

// Start the server
app.listen(port, () => {
  console.log(`We are now listening on port ${port}`);
});
