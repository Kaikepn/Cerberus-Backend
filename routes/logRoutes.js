import express from "express"
import logController from "../src/controllers/logController.js";
import { verifyJWT } from "../src/middlewares/jwtConfig.js";

const routes = express.Router();

routes.post("/log", verifyJWT, logController.create)
routes.get("/log/:id", verifyJWT, logController.list)
routes.get("/log/code/:code", verifyJWT, logController.listByCode)

export default routes;