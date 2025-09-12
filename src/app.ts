import express from "express";
import cors from "cors";
import adminRouter from "./routes/admin.route.js";
import authRouter from "./routes/auth.route.js";
import { MErrorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);

// Error handling middleware
app.use(MErrorHandler);

app.listen(3000, () => {
  console.log("Server is running on https://localhost:3000");
});
