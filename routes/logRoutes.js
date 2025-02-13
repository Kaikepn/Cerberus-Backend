import express from "express"
import { verifyJWT } from "../src/middlewares/jwtConfig.js";
import logController from "../src/controllers/logController.js";

const routes = express.Router();

routes.post("/log", logController.create)
routes.get("/log", logController.list)

export default routes;