import express from "express"
import databaseConnect from "./src/database/connection.js"
import routes from './index.js'

const connection = await databaseConnect();

connection.on("error", (error) =>{
    console.log("erro de conexão")
});

connection.once("open", () =>{
    console.log("conexão feita com sucesso.")
});


const app = express();

routes(app);

export default app;