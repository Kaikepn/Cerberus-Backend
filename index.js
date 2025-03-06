import express from "express"
import products from "./routes/productRoutes.js"
import users from "./routes/userRoutes.js"
import logs from "./routes/logRoutes.js"

const routes = (app) => {
    app.route("/").get((req, res) => res.status(200).send("projeto teste"));

    app.use(express.json(), users, products, logs);
};

export default routes;
