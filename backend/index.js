import express from "express";
import dotenv from "dotenv";
import imageRouter from "./src/Router/image.router.js";
import userRouter from "./src/Router/user.router.js";
import { connectMongoDB } from "./src/Connect/connectMongo.js";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config({ path: "./.env" });

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
console.log( process.env.CORS_ORIGIN);
console.log("I am connected");
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cors(corsOptions));
app.use(cookieParser());

const port = process.env.PORT || 3003;

// database connection
app.get("/", (req, res) => {
  console.log("getting the request");
});

connectMongoDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is listening at port", port);
    });
  })
  .catch((error) => {
    console.log("error", error);
  });

process.on("SIGINT", async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error during shutdown:", error);
  } finally {
    process.exit(0);
  }
});
app.get("/", (req, res) => {
  res.send("server is listening..");
});
// app.get("*", (req, res) => {
//   res.sendFile(
//     path.resolve(__dirname, "frontend", "vite-project", "dist", "index.html")
//   );
// });
// router set-up
app.use("/api/v1/user", userRouter);
app.use("/api/v1/image", imageRouter);

