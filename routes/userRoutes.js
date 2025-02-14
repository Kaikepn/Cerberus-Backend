import express from "express"
import userController from "../src/controllers/userController.js"
import { verifyJWT } from "../src/middlewares/jwtConfig.js";

const routes = express.Router();

routes.post("/user", userController.create)
routes.post("/user/login", userController.login);
routes.post("/user/login/:cpf", userController.loginCPF);
routes.get("/user", verifyJWT, userController.list);
routes.get("/user/:id", verifyJWT, userController.listOne);
routes.put("/user/:id", verifyJWT, userController.update);
routes.put("/user/points/:cpf", userController.updatePoints);
routes.delete("/user/:id", verifyJWT, userController.delete)

export default routes;