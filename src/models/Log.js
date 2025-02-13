import mongoose from "mongoose"
import { userSchema } from "./User.js";

const logSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    points: {type: Number, required: true},
    activityDate: {type: Date, default: 0, required: false},
}, {versionKey: false});

const Log = mongoose.model("log", logSchema);

export {Log, logSchema};