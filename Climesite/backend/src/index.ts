import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import authRouter from "./routes/auth";
import weatherRouter from "./routes/weather";

dotenv.config();

const PORT = Number(process.env.PORT || 3001);

const app = express();
app.use(cors());
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("DataSource initialized");

    app.use("/api", authRouter);
    app.use("/api", weatherRouter);

    app.get("/health", (req, res) => res.json({ ok: true }));

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Error initializing DataSource", err);
    process.exit(1);
  });
