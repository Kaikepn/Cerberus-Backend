import { Product } from "../models/Product.js";
import apiErrors from "../classes/apiErrors.js";

const productController = {

    list: async (req, res) => {
        try {
            let productList = await Product.find({ isActive: true });
    
            if (productList.length === 0) {
                throw new apiErrors("Não existem produtos no banco de dados", 400);
            }
    
            // Converter imagens para Base64 antes de enviar ao frontend
            const formattedProducts = productList.map(product => ({
                ...product._doc,  // Mantém os outros campos
                img: product.img?.data
                    ? `data:${product.img.contentType};base64,${product.img.data.toString("base64")}`
                    : null
            }));
    
            return res.json(formattedProducts);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
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

    // create: async (req, res) => {
    //     try{
    //         const product = await Product.create(req.body);
    //         res.status(201).json({ msg: "produto adicionado com sucesso!"});
    //     } catch (error) {
    //         if(error.message.includes("duplicate key error collection: Cerberus.products index: name_1 dup key: { name:"))
    //             return res.status(400).json({ message: `Falha ao cadastrar produto: Produto com esse nome já cadastrado.`});
    //         res.status(400).json({ message: `${error.message}`});
    //     }
    // },
    create: async (req, res) => {
        try {
            const { name, price, stock } = req.body;

            if (!req.file) {
                throw new apiErrors("Imagem é obrigatória", 400);
            }

            const newProduct = new Product({
                name,
                price,
                stock,
                img: {
                    data: req.file.buffer, // Buffer da imagem
                    contentType: req.file.mimetype, // Tipo do arquivo
                }
            });

            await newProduct.save();
            res.status(201).json({ msg: "Produto adicionado com sucesso!" });

        } catch (error) {
            if (error.message.includes("duplicate key error collection")) {
                return res.status(400).json({ message: "Produto com esse nome já cadastrado." });
            }
            res.status(400).json({ message: `${error.message}` });
        }
    },

    update: async (req, res) => {
        const id = req.params.id;
        try{    
            const product = await Product.findByIdAndUpdate(id, req.body);
            if(!product) throw new apiErrors("id não encontrado", 404);
            res.status(200).json({ msg: "produto atualizado"});
        } catch (error) {
            if(error.message.includes("duplicate key error collection: Cerberus.products index: name_1 dup key: { name:"))
                return res.status(400).json({ message: `Falha ao atualizar produto: Produto com esse nome já cadastrado.`});
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