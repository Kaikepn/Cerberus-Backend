import ProductService from "../services/productService.js";

const productController = {
    list: async (req, res) => {
        try {
            const products = await ProductService.listProducts();
            res.json(products);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    listData: async (req, res) => {
        try {
            const products = await ProductService.listProductsData();
            res.json(products);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    listOne: async (req, res) => {
        try {
            const product = await ProductService.getProductById(req.params.id);
            res.json(product);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            await ProductService.createProduct(req.body, req.file);
            res.status(201).json({ msg: "Produto adicionado com sucesso!" });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            await ProductService.updateProduct(req.params.id, req.body);
            res.status(200).json({ msg: "Produto atualizado" });
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await ProductService.deleteProduct(req.params.id);
            res.status(200).json({ msg: "Produto removido com sucesso" });
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    }
};

export default productController;
