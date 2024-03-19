import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import upload from "express-fileupload";
import http from "http";
import {getClientIp} from 'request-ip';
import {rateLimit} from "express-rate-limit";

import staticFiles from "./utils/middleware/staticFiles.js";
import errorHandler from "./utils/middleware/error.js";
import router from "./routes/index.js";
import task from "./utils/tasks/task.js";

dotenv.config({ path: `./config.${process.env.NODE_ENV}.env` });

const app = express();

initMiddleware();
initDatabase();
startApp();
task();
app.use(errorHandler);

function initMiddleware() {
  app.use(cors());
  app.use(helmet());
  app.use(express.json({ limit: "10kb" }));
  app.use(upload());
  
  staticFiles(app);

  const limiter = rateLimit({
    limit: 200,
    windowMs: 15 * 60 * 1000, //15 mints
    standardHeaders: true, 
    legacyHeaders: false, 
    keyGenerator: (req, res) => {
      return getClientIp(req);
    },
    message: "Too many requests from this IP, please try again in an hour!",
  });
  app.use(limiter);
}

function initDatabase() {
  const url = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
  );
  mongoose
    .connect(url, {
      useNewUrlParser: true,
    })
    .then(() => console.log("DB connection went successful!"))
    .catch((e) => console.error(e));

  const { connection: db } = mongoose;

  db.once("open", () => console.log("Connected to mongodb"));
  db.once("disconnected", () => console.log("Disconnected from mongodb"));
  db.on("error", (err) => console.log(`Error connecting to mongodb `, err));
}

function startApp() {
  app.use("/", router);
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
