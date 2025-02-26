import express from "express"
import logController from "../src/controllers/logController.js";
import { verifyJWT } from "../src/middlewares/jwtConfig.js";

const routes = express.Router();

routes.post("/log", verifyJWT , logController.create)
routes.get("/log", verifyJWT, logController.getTrash)
routes.get("/log/:userId", verifyJWT, logController.list)
routes.get("/log/redeemed/:userId", verifyJWT, logController.listByRedeemed)
routes.get("/log/not/redeemed/:userId", verifyJWT, logController.listByNotRedeemed)
routes.get("/log/code/:code", verifyJWT, logController.listByCode)
routes.put("/log/:id", verifyJWT, logController.update)
routes.put("/log/:token", verifyJWT, logController.update)

export default routes;