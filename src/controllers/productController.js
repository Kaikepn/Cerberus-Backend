import { Product } from "../models/Product.js";
import apiErrors from "../classes/apiErrors.js";

const productController = {

    list: async (req, res) => {
        let productList = await Product.find({isActive: true});
        try{
            if(productList.length === 0) throw new apiErrors("Não existem produtos no banco de dados", 400);
            return res.json(productList);
        } catch (error) {
            res.status(error.statusCode).json({ message: `${error.message}` });
        }
    },

    listOne: async (req, res) => {
        const id = req.params.id;
        const product = await Product.findById(id);
        try{            
            if(!product) throw new apiErrors("id não encontrado", 404);
            return res.json(product);
        } catch (error) {
            res.status(error.statusCode).json({ message: `${error.message}` });
        }
    },

    create: async (req, res) => {
        try{
            const product = await Product.create(req.body);
            res.status(201).json({ msg: "produto adicionado com sucesso!"});
        } catch (error) {
            res.status(400).json({ message: `${error.message}`});
        }
    },

    update: async (req, res) => {
        const id = req.params.id;
        const product = await Product.findByIdAndUpdate(id, req.body);
        try{    
            if(!product) throw new apiErrors("id não encontrado", 404);
            res.status(200).json({ msg: "produto atualizado"});
        } catch (error) {
            res.status(error.statusCode).json({ message: `${error.message}` });
        }

    },

    delete: async (req, res) => {
        const id = req.params.id;
        const product = await Product.findByIdAndDelete(id);
        try{    
            if(!product) throw new apiErrors("id não encontrado", 404);
            res.status(200).json({ msg: "produto removido com sucesso"});

        } catch (error) {
            res.status(error.statusCode).json({ message: `${error.message}` });
        }
    }
}

export default productController;