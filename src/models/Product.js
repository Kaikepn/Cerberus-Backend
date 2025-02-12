import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true},
    price: {type: Number, required: true, unique: true},
    stock: {type: Number, default: 0, required: false},
    isActive: {type: Boolean, default: true, required: false}
}, {versionKey: false});

const Product = mongoose.model("product", productSchema);

export {Product, productSchema};