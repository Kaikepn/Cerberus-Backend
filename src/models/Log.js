import mongoose from "mongoose"

const logSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    points: {type: Number, required: true},
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: false },
    activityDate: {type: Date, default: 0, required: false},
}, {versionKey: false});

const Log = mongoose.model("log", logSchema);

export {Log, logSchema};