import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true, unique: true},
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    isActive: {type: Boolean, required: false}

}, {versionKey: false});

const User = mongoose.model("user", userSchema);

export {User, userSchema};