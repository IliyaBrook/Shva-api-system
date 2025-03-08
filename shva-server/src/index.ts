import "dotenv/config";
import errorMiddleware from "@/middlewares/error-middleware";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as process from "node:process";
import path from "path";
import router from "./router/index";
import { sequelize } from "./database/db";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

const isProd = process.env.NODE_ENV === "production";
const PORT: number =
  Number(isProd ? process.env.PROD_PORT : process.env.PORT) || 5000;
const app: express.Application = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
    allowedHeaders: ["Origin", "Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "Set-Cookie"],
    methods: ["GET", "POST"],
  }),
);
app.use("/api", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorMiddleware);

// Serve static files from the React client app (SPA build) ONLY in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(
    __dirname,
    "../../shva-client/build/client",
  );
  app.use(express.static(clientBuildPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

const start = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server running at PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

void start();
