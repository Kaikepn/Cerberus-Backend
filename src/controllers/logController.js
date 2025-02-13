import { User } from "../models/User.js";
import { Log } from "../models/Log.js"
import apiErrors from "../classes/apiErrors.js";

const logController = {
    
    create: async (req, res) => {
        try{
            const user = req.body.user;
            let log = req.body;
            if(!user) throw new apiErrors("Usuário deve ser fornecido.", 400);
            const foundUser = await User.findById(user);
            if (!foundUser) throw new apiErrors("Usuário não encontrado.", 400);
            log.user = foundUser
            log.activityDate = Date.now()
            log = await Log.create(req.body);
            res.status(201).json({ msg: "log criado com sucesso!"});
        } catch (error) {
            res.status(400).json({ message: `${error.message}`});
        }
    },

    list: async (req, res) => {
        let logList = await Log.find({});
        try{
            if(logList.length === 0) throw new apiErrors("Não existem produtos no banco de dados", 400);
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