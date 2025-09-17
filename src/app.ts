import express from "express";
import cors from "cors";
import { MErrorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import { connectRedis } from "./configs/redis.config";
import { connect } from "http2";

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

app.use(MErrorHandler);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
