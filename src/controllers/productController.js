import Product from "../models/Product"
import apiErrors from "../classes/apiErrors.js"

const productController = {
    create: async (req, res) => {
        const product = req.body;
        try{
            const newProduct = await Product.create(product);
            if(!newProduct) throw new apiErrors("Falha ao criar produto", 400);
            res.status(201).json({message: "Produto Cadastrado com sucesso."})
        } catch (error){
            res.status(error.statusCode || 500).json({ message: `Falha ao cadastrar produto: ${error.message}`});
        }
    }

    // list: async (req, res) => {

    // }
}