import express from "express"
import userController from "../src/controllers/userController.js"
import { verifyJWT } from "../src/middlewares/jwtConfig.js";

const routes = express.Router();

routes.post("/user", userController.create)
routes.post("/user/login", userController.login);
routes.post("/user/login/:cpf", userController.loginCPF);
routes.post("/user/password/:token", userController.updatePassword)
routes.get("/user", verifyJWT,  userController.list);
routes.get("/user/:id", verifyJWT, userController.listOne);
routes.put("/user/:id", userController.update);
routes.delete("/user/:id", verifyJWT, userController.delete);
routes.post("/user/forgot", userController.forgotPassword)
routes.get("/user/forgot/:token", userController.resetPassword)

export default routes;