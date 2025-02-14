import { User } from "../models/User.js";
import { Log } from "../models/Log.js"
import { Product } from "../models/Product.js";
import apiErrors from "../classes/apiErrors.js";

const logController = {
    
    // create: async (req, res) => {
    //     try{
    //         const user = req.body.user;
    //         const product = req.body.product
    //         let log = req.body;
    //         if(!user) throw new apiErrors("Usuário deve ser fornecido.", 400);
    //         const foundUser = await User.findById(user);
    //         if(product) log.product = await Product.findById(product);
    //         if (!foundUser) throw new apiErrors("Usuário não encontrado.", 400);
    //         log.user = foundUser
    //         log.activityDate = Date.now()
    //         console.log(log)
    //         log = await Log.create(log);
    //         res.status(201).json({ msg: "log criado com sucesso!"});
    //     } catch (error) {
    //         res.status(400).json({ message: `${error.message}`});
    //     }
    // },

    create: async (req, res) => {
        try{
            const product = req.body.product
            let log = req.body;
            if(!req.body.user) throw new apiErrors("Usuário deve ser fornecido.", 400);
            const foundUser = await User.findById(req.body.user);
            if(product) log.product = await Product.findById(product);
            if (!foundUser) throw new apiErrors("Usuário não encontrado.", 400);
            const userPoints = parseInt(req.body.points)
            const points = (parseInt(foundUser.points) + parseInt(req.body.points));
            console.log(foundUser)
            console.log("tot:" + points+" "+ foundUser.points +" "+ req.body.points)
            const updatedUser = await User.findByIdAndUpdate(
                foundUser._id,
                { points: points },  // Passa um objeto com os novos pontos
                { new: true }         // Retorna o usuário atualizado
            );
            log.updatedUser = updatedUser
            log.activityDate = Date.now()
            //console.log(log)
            log = await Log.create(log);
            res.status(201).json({ msg: "log criado com sucesso!"});
        } catch (error) {
            res.status(400).json({ message: `${error.message}`});
        }
    },

    list: async (req, res) => {
        const id = req.params.id;
        let logList = await Log.find({user: id}).populate('user').populate('product');
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

    // delete: async (req, res) => {
    //     const id = req.params.id;
    //     const log = await Log.findByIdAndDelete(id);
    //     try{    
    //         if(!log) throw new apiErrors("id não encontrado", 404);
    //         res.status(200).json({ msg: "produto removido com sucesso"});

    //     } catch (error) {
    //         res.status(error.statusCode).json({ message: `${error.message}` });
    //     }
    // }
}

export default logController;