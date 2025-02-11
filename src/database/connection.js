import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function databaseConnect() {
    mongoose.connect(process.env.DB_CONNECTION_STRNG);
    return mongoose.connection;
}

export default databaseConnect;