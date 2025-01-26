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
const port = 8080;

app.use(
  cors({
    origin: `${process.env.CLIENT_DOMAIN}`,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", propertiesRouter);

(async () => {
  try {
    await connectDB();
    console.log("Database connection established...");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on http://localhost:${process.env.PORT}`)
    );
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
