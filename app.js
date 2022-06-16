import path from "path";
import express from "express";
import dotenv from "dotenv";
import mssql from "mssql";
import userRoute from "./routers/userRoute.js";
import sendNotifications from "./routers/sendNotifications.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.cjs";
import cors from "cors";
import bodyParser from "body-parser";
import { sqlConfig } from "./database.js";

const app = express();

app.use(
  cors({
    origin: "*",
    // methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
  })
);

dotenv.config();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(express.json());
app.use("/api/Users", userRoute);
app.use("/api/Notifications", sendNotifications);
app.use(express.static("assets" + "/images"));

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mssql
  .connect(sqlConfig)
  .then((pool) => {
    console.log(pool);
    if (pool.connecting) {
      console.log("connecting");
    }
    if (pool.connected) {
      console.log("connected now!");
    }
    return pool;
  })
  .catch(function (err) {
    console.log("failed to open connection to database");
    console.log(err);
  });

mssql.on("error", (err) => {
  console.log(err.message);
});

const __dirname = path.resolve();
const PORT = process.env.PORT || 9200;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
