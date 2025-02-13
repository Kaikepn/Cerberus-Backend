import express from "express"
import users from "./routes/userRoutes.js"
import products from "./routes/productRoutes.js"

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("projeto teste"));

    app.use(express.json(), users, products);
};

export default routes;
