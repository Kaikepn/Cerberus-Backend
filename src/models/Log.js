import mongoose from "mongoose"

const logSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    metalDiscarted: {type: Number, required: false},
    plasticDiscarted: {type: Number, required: false},
    points: {type: Number, required: true},
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: false },
    code: {type: String, required: false},
    redeemed: {type: Boolean, required: false},
    activityDate: {type: String, default: 0, required: false},
}, {versionKey: false});

const Log = mongoose.model("log", logSchema);

export {Log, logSchema};