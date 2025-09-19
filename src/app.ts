import express from "express";
import cors from "cors";
import { MErrorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import counterRoutes from "./routes/counter.routes";
import queueRoutes from "./routes/queue.routes";
import { connectRedis } from "./configs/redis.config";

connectRedis();
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/counter", counterRoutes);
app.use("/api/v1/queue", queueRoutes);

app.use(MErrorHandler);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
