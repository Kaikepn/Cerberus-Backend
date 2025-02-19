import { User } from "../models/User.js"
import { jwtController } from "../middlewares/jwtConfig.js"
import apiErrors from "../classes/apiErrors.js"
import bcrypt from "bcrypt"

const userController = {
    create: async (req, res) => {
        const user = req.body;
        const password = user.password;
        const cpf = user.cpf;
        try{
            let lastThreeDigits = cpf.slice(-3);
            let userFound = await checkCPF(cpf, lastThreeDigits);
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
            if(error.message.includes("duplicate key error collection: Cerberus.users index: email_1 dup key: { email:"));
                return res.status(400).json({ message: `Falha ao cadastrar usuário: email já cadastrado.`});
            res.status(error.statusCode || 500).json({ message: `Falha ao cadastrar usuário: ${error.message}`});
        }
    },

    login: async (req, res) => {
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

    
    loginCPF: async (req, res) => {
        try {
            const { cpf } = req.params;
            const userFound = await checkCPF(cpf, cpf.slice(-3));    
            if (!userFound) {
                throw new apiErrors("CPF inválido", 401);
            }    
            const token = jwtController.sign(userFound._id);
            return res.json({ auth: true, token });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    list: async (req, res) => {
    const userList = await User.find({isActive: true});
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
        try{
        let user = await User.findByIdAndUpdate(id, req.body);
            if(!user) throw new apiErrors("Usuário não encontrado.", 404);
            res.status(200).json("Usuário atualizado com sucesso!");
        } catch (error) {
            if(error.message.includes("duplicate key error collection: Cerberus.users index: email_1 dup key:"));
                return res.status(400).json({ message: `Falha ao atualizar usuário: email já cadastrado.`});
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

async function checkCPF(cpf, lastThreeDigits) {
    const users = await User.find({
        lastThree: { "$regex": `${lastThreeDigits}$` },
        isActive: true
    });
    const userFound = await Promise.all(users.map(async (user) => {
        const isMatch = await bcrypt.compare(cpf, user.cpf);
        return isMatch ? user : null;
    }));
    return userFound.find(user => user !== null) || null;
}

export default userController;