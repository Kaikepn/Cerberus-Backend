import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    cpf: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    metalDiscarted: {type: Number, default: 0, required: false},
    paperDiscarted: {type: Number, default: 0, required: false},
    //pontos?
    //isAdmin
    isActive: {type: Boolean, default: true, required: false}
}, {versionKey: false});

const User = mongoose.model("user", userSchema);

export {User, userSchema};