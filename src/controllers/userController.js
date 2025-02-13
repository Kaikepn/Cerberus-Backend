import { User } from "../models/User.js"
import apiErrors from "../classes/apiErrors.js"
import { jwtController } from "../middlewares/jwtConfig.js"
import bcrypt from "bcrypt"

const userController = {
    create: async (req, res) => {
        const user = req.body;
        const password = user.password;
        const cpf = user.cpf;
        try{
            let lastThreeDigits = cpf.slice(-3)
            let userFound = await checkCPF(cpf, lastThreeDigits)
            if (userFound) {
                throw new apiErrors("CPF inválido", 401);
            }
            const hashedCPF = await bcrypt.hash(cpf, 10);
            const hashedPassword = await bcrypt.hash(password, 10);
            user.cpf = hashedCPF;
            user.password = hashedPassword;
            user.lastThree = lastThreeDigits;
            const newUser = await User.create(user);
            if(!newUser) throw new apiErrors("Falha ao cadastrar usuário.", 404);
            res.status(201).json({ message: "Usuário criado com sucesso!"});
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: `Falha ao cadastrar usuário: ${error.message}`});
        }
    },

    login: async (req, res, next) => {
        try{
            const email = req.body.email;
            const password = req.body.password;
            let foundUser = await User.find({email: email});
            let user = foundUser[0];
            if(!user) throw new apiErrors("Email ou senha inválidos. (1)", 401);
            if(!(await bcrypt.compare(password, user.password))) throw new apiErrors("Email ou senha inválidos. (2)", 401);
            const id = user._id;
            const token = jwtController.sign(id);
            return res.json({ auth: true, token: token });
        } catch (error){
            res.status(error.statusCode || 500).json({ message: `${error.message}` });
        }
    },

    updatePoints: async (req, res) =>{
        try {
            let cpf = req.params.cpf;
            let foundUsers = await User.find({});
            if (foundUsers.length === 0) {
                throw new apiErrors("Nenhum usuário encontrado", 404);
            }
            let userFound = null;    
            for (let i = 0; i < foundUsers.length && userFound == null; i++) {
                const user = foundUsers[i];
                const isMatch = await bcrypt.compare(cpf, user.cpf);
                if (isMatch) {
                    userFound = user;
                }
            }
            if (!userFound) {
                throw new apiErrors("CPF inválido", 401);
            }
            const user = await User.findByIdAndUpdate(userFound._id, req.body);
            res.status(200).json("Pontos foram recebidos com sucesso!");
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: `${error.message}` });
        }
    },

    loginCPF: async (req, res) => {
        try {
            let cpf = req.params.cpf;
            let lastThreeDigits = cpf.slice(-3)
            let userFound = await checkCPF(cpf, lastThreeDigits)
            if (!userFound) {
                throw new apiErrors("CPF inválido", 401);
            }
            const id = userFound._id;
            const token = jwtController.sign(id);
            return res.json({ auth: true, token: token });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: `${error.message}` });
        }
    },

    list: async (req, res) => {
        const userList = await User.find({});
        try{
            if(userList.length === 0) throw new apiErrors("Não existem usuários cadastrados.", 404);
            return res.json(userList);
        } catch (error){
            res.status(error.statusCode || 500).json({ message: `Falha ao carregar usuários: ${error.message}` });
        }
    },

    listOne: async (req, res) => {
        try {
            const id = req.params.id;
            let user = await User.findById(id).lean();    
            if (!user) {
                throw new apiErrors("Usuário não encontrado.", 404);
            }    
            delete user.password;
            return res.json(user);
    
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: `Falha ao carregar usuário: ${error.message}` });
        }
    },

    update: async (req, res) => {
        const id = req.params.id;
        let user = await User.findByIdAndUpdate(id, req.body);
        try{
            if(!user) throw new apiErrors("Usuário não encontrado.", 404);
            res.status(200).json("Usuário atualizado com sucesso!");
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: `Falha ao atualizar usuário: ${error.message}`});
        }
    },

    delete: async (req, res) => {
        const id = req.params.id;
        let user = await User.findByIdAndDelete(id);
        try{
            if(!user) throw new apiErrors("Usuário não encontrado.", 404);
            res.status(200).json({ message: "Usuário deletado com sucesso!"});
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: `Falha ao excluir usuário: ${error.message}`});
        }
    },

}

async function checkCPF(cpf, lastThreeDigits){
    let foundUsers = await User.find({
        lastThree: { "$regex": `${lastThreeDigits}$`}
    });
    if (foundUsers.length === 0) {
        return null
    }
    let userFound = null;    
    for (let i = 0; i < foundUsers.length && userFound == null; i++) {
        const user = foundUsers[i];
        const isMatch = await bcrypt.compare(cpf, user.cpf);
        if (isMatch) {
            userFound = user;
        }
    }
    return userFound
}

export default userController;