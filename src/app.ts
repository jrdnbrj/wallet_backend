import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import errorMiddleware from "./middlewares/errors/errorHandler";
import clientRoutes from "./routes/clientRoutes";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/api/clients", clientRoutes);

app.use(errorMiddleware);

export default app;
