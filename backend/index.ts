import express, { Express } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import connectDB from "./config/database";
import profileRouter from "./routes/profile";
import propertiesRouter from "./routes/properties";
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: [
      "https://foreclosureatlas.com",
      "https://www.foreclosureatlas.com",
      "https://the1416group.com",
      "https://www.the1416group.com",
      "http://localhost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // start server
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", propertiesRouter);

(async () => {
  try {
    await connectDB();
    console.log("Database connection established...");
    app.listen(port, () => console.log(`Server running on ${port}`));
  } catch (err) {
    console.error(
      "Database connection failed:",
      err instanceof Error ? err.message : err
    );
  }
})();

process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  process.exit();
});

process.on("SIGTERM", () => {
  console.log("Shutting down gracefully...");
  process.exit();
});
