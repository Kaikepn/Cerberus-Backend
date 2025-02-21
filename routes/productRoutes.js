import express from "express"
import productController from "../src/controllers/productController.js"
import { upload } from "../src/middlewares/multerController.js"
import { verifyJWT } from "../src/middlewares/jwtConfig.js";

const routes = express.Router();

//routes.post("/product", productController.create)
routes.post("/product", upload.single("img"), productController.create);
routes.get("/product",  productController.list);
routes.get("/product/data", productController.listData);
routes.get("/product/:id", productController.listOne);
routes.put("/product/:id", productController.update);
routes.delete("/product/:id", productController.delete)

export default routes;