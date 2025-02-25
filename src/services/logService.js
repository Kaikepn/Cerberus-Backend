import { User } from "../models/User.js";
import { Log } from "../models/Log.js"
import { Product } from "../models/Product.js";
import apiErrors from "../classes/apiErrors.js";
import bcrypt from "bcrypt";

class LogService {
    static async create(logData) {
        logData.activityDate = new Date().toLocaleString();
        if (!logData.user) throw new apiErrors("Usuário deve ser fornecido.", 400);
        
        const foundUser = await User.findById(logData.user);
        if (!foundUser) throw new apiErrors("Usuário não encontrado.", 400);
        
        const updatedPoints = parseInt(foundUser.points) + parseInt(logData.points);
        if (updatedPoints < 0) throw new apiErrors("Saldo inválido.", 400);
        
        let plasticDiscarted = parseInt(foundUser.plasticDiscarted) || 0;
        let metalDiscarted = parseInt(foundUser.metalDiscarted) || 0;
        
        if (logData.plasticDiscarted) plasticDiscarted += parseInt(logData.plasticDiscarted);
        if (logData.metalDiscarted) metalDiscarted += parseInt(logData.metalDiscarted);
        
        const updatedUser = await User.findByIdAndUpdate(
            foundUser._id,
            { points: updatedPoints, metalDiscarted, plasticDiscarted },
            { new: true }
        );
        
        if (logData.product) {
            const productFound = await Product.findById(logData.product);
            if (!productFound) throw new apiErrors("Produto não encontrado", 404);
            
            let updatedStock = parseInt(productFound.stock) - 1;
            if (updatedStock < 0) throw new apiErrors("Estoque insuficiente.", 400);
            
            await Product.findByIdAndUpdate(
                productFound._id,
                { stock: updatedStock, isActive: updatedStock > 0 },
                { new: true }
            );
            
            const hash = await bcrypt.hash(logData.activityDate, 5);
            logData.code = hash.substring(hash.length - 5);
            logData.redeemed = false;
        }
        
        logData.updatedUser = updatedUser;
        return await Log.create(logData);
    }
    
    static async listByUser(userId) {
        const logList = await Log.find({ user: userId });
        if (logList.length === 0) throw new apiErrors(`Não existem logs para usuario ${userId}`, 400);
        return logList;
    }
    
    static async findByCode(code) {
        const log = await Log.find({ code });
        if (log.length === 0) throw new apiErrors("Código não encontrado", 404);
        return log;
    }

    static async listByRedeemed(userId) {
        console.log(userId)
        const log = await Log.find({ user: userId, redeemed: true });
        console.log()
        if (log.length === 0) throw new apiErrors("Nenhum produtro foi resgatado", 404);
        return log;
    }

    static async listByNotRedeemed(code) {
        const log = await Log.find({ redeemed: false });
        if (log.length === 0) throw new apiErrors("Nenhuma troca foi realizada ", 404);
        return log;
    }

    static async update(id) {
        const product = await Log.findByIdAndUpdate(id, {redeemed: true}, { new: true });
        if (!product) {
            throw new apiErrors("ID não encontrado", 404);
        }
        return product;
    }
}

export default LogService;
