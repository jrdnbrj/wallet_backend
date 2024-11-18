import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import errorMiddleware from "./middlewares/errors/errorHandler";
import clientRoutes from "./routes/clientRoutes";
import walletRoutes from "./routes/walletRoutes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/api/clients", clientRoutes);
app.use("/api/wallet", walletRoutes);

app.use(errorMiddleware);

export default app;
