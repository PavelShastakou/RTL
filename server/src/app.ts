import express from "express";
import compression from "compression";
import bodyParser from "body-parser";

import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import ActorsController from "./controllers/actorsController/ActorsController";
import ShowsController from "./controllers/showsController/ShowsController";
import ShowsActorsController from "./controllers/showsActorsController/ShowsActorsController";
import BaseController from "./controllers/BaseController";
import { RequestHandlerParams } from "express-serve-static-core";

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/actors", ActorsController);
app.use("/shows", ShowsController);
app.use("/showsActors", ShowsActorsController);

app.get("*", BaseController.handleNotFound);

export default app;
