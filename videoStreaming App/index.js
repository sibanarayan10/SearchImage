import express from "express";
import dotenv from 'dotenv';
import imageRouter from "./src/Router/image.router.js";
import userRouter from "./src/Router/user.router.js"
import { connectMongoDB } from "./src/Connect/connectMongo.js";
import mongoose from "mongoose";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app = express();
dotenv.config({ path: './.env' });



const corsOptions = {
  origin: "*",  
  credentials: true,                // Allow credentials (cookies, auth tokens)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],     // Allowed headers
};


app.use(cors(corsOptions));


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));


app.use(cookieParser());

const port = process.env.PORT || 3001;
connectMongoDB().then(() => {
  app.listen(port, () => {
    console.log("Server is listening at port", port);
  });
}).catch((error) => {
  console.log(error);
});


process.on('SIGINT', async () => {
  try {
 
    await mongoose.disconnect(); 
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error during shutdown:', error);
  } finally {
    process.exit(0);
  }
});

// Define routes after middleware
app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);