import express from "express"
import userController from "../src/controllers/userController.js"
import { verifyJWT } from "../src/middlewares/jwtConfig.js";

const routes = express.Router();

routes.post("/user", userController.create)
routes.post("/user/login", userController.login);
routes.post("/user/login/:cpf", userController.loginCPF);
routes.get("/user",  userController.list);
routes.get("/user/:id" , userController.listOne);
routes.put("/user/:id" , userController.update);
routes.delete("/user/:id", userController.delete)
// routes.put("/user/points/:cpf", userController.updatePoints);

export default routes;