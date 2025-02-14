import express from "express"
import logController from "../src/controllers/logController.js";

const routes = express.Router();

routes.post("/log", logController.create)
routes.get("/log/:id", logController.list)

export default routes;