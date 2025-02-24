import { Product } from "../models/Product.js";
import apiErrors from "../classes/apiErrors.js";

class ProductService {
    static async listProducts() {
        const productList = await Product.find({ isActive: true });
        if (productList.length === 0) {
            throw new apiErrors("Não existem produtos no banco de dados", 400);
        }
        return productList.map(product => ({
            ...product._doc,
            img: product.img?.data
                ? `data:${product.img.contentType};base64,${product.img.data.toString("base64")}`
                : null
        }));
    }

    static async listProductsData() {
        const productList = await Product.find({ isActive: true }, "-img");
        if (productList.length === 0) {
            throw new apiErrors("Não existem produtos no banco de dados", 400);
        }
        return productList;
    }

    static async getProductById(id) {
        const product = await Product.findById(id);
        if (!product) {
            throw new apiErrors("ID não encontrado", 404);
        }
        return product;
    }

    static async createProduct(data, file) {
        if (!file) {
            throw new apiErrors("Imagem é obrigatória", 400);
        }
        const newProduct = new Product({
            ...data,
            img: {
                data: file.buffer,
                contentType: file.mimetype,
            }
        });
        await newProduct.save();
    }

    static async updateProduct(id, updateData) {
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) {
            throw new apiErrors("ID não encontrado", 404);
        }
        return product;
    }

    static async deleteProduct(id) {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            throw new apiErrors("ID não encontrado", 404);
        }
    }
}

export default ProductService;
