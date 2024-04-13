/* eslint-disable no-console */
import express from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";
import mongoose from "mongoose";
import * as routes from "./routes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import SwaggerDef from "./swaggerDef.json";
const app = express();
// database setup
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost/mydb";
mongoose.connect(mongoUri, {});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(compression());

app.use("/api", routes.hello);
app.use("/api/users", routes.users);
app.use("/api/store", routes.store);
app.use("/api/transactions", routes.transactions);
app.use("/api/cash", routes.cash);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(SwaggerDef));
module.exports = app;
