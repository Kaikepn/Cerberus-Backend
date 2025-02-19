import express from "express"
import databaseConnect from "./src/database/connection.js"
import routes from './index.js'
import cors from 'cors' 

const connection = await databaseConnect();

connection.on("error", (error) =>{
    console.log("erro de conexão");
});

connection.once("open", () =>{
    console.log("conexão feita com sucesso.");
});

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

routes(app);

export default app;