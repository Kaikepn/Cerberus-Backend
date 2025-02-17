import { User } from "../models/User.js";
import { Log } from "../models/Log.js"
import { Product } from "../models/Product.js";
import apiErrors from "../classes/apiErrors.js";

const logController = {

    create: async (req, res) => {
        try{
            const product = req.body.product
            let log = req.body;
            if(!log.user) throw new apiErrors("Usuário deve ser fornecido.", 400);
            const foundUser = await User.findById(log.user);
            if (!foundUser) throw new apiErrors("Usuário não encontrado.", 400);
            const updatedPoints = (parseInt(foundUser.points) + parseInt(log.points));
            if(updatedPoints < 0) throw new apiErrors("Saldo inválido.", 400)
            let plasticDiscarted = (parseInt(foundUser.plasticDiscarted))
            let metalDiscarted = parseInt(foundUser.metalDiscarted)
            if(log.plasticDiscarted) plasticDiscarted += parseInt(log.plasticDiscarted)
            if(log.plasticDiscarted) metalDiscarted += parseInt(log.metalDiscarted)            
            const updatedUser = await User.findByIdAndUpdate(
                foundUser._id,
                { points: updatedPoints, 
                  metalDiscarted: metalDiscarted,
                  plasticDiscarted: plasticDiscarted},
                { new: true });
            if(product) {
                const productFound = await Product.findById(product);
                let updatedStock = (parseInt(productFound.stock) - 1);
                if(updatedStock <= 0) {
                    log.product = await Product.findByIdAndUpdate(
                        productFound._id,
                        { isActive: false},
                        { new: true}
                    );
                    if(updatedStock < 0) throw new apiErrors("Estoque insuficiente.", 400)
                }
                log.product = await Product.findByIdAndUpdate(
                    productFound._id, 
                    { stock: updatedStock},
                    { isActive: "false"},
                    { new: true}
                );
            }
            log.updatedUser = updatedUser
            log.activityDate = Date.now()
            log = await Log.create(log);
            res.status(201).json({ msg: "log criado com sucesso!"});
        } catch (error) {
            res.status(400).json({ message: `${error.message}`});
        }
    },

    list: async (req, res) => {
        const id = req.params.id;
        let logList = await Log.find({user: id}).populate('product', '-stock');
        try{
            if(logList.length === 0) throw new apiErrors(`Não existem logs para usuario ${id}`, 400);
            return res.json(logList);
        } catch (error) {
            res.status(error.statusCode).json({ message: `${error.message}` });
        }
    },

    listOne: async (req, res) => {
        const userId = req.params.id;
        const log = await Log.find({user: userId});
        try{            
            if(!log) throw new apiErrors("id não encontrado", 404);
            return res.json(log);
        } catch (error) {
            res.status(error.statusCode).json({ message: `${error.message}` });
        }
    },
}

export default logController;