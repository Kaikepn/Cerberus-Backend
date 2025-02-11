import express from "express"
import userController from "../src/controllers/userController.js"

const routes = express.Router();

routes.post("/user", userController.create)
routes.get("/user", userController.list);
routes.get("/user/:id", userController.listOne);
routes.put("/user/:id", userController.update);
routes.delete("/user/:id", userController.delete)
routes.post("/user/login", userController.login);

export default routes;