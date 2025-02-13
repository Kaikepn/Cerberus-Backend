import express from "express"
import cors from 'cors' // Add this import
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
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

routes(app);

export default app;