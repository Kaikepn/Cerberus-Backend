import { User } from "../models/User.js"
import { Log } from "../models/Log.js"
import { jwtController } from "../middlewares/jwtConfig.js"
import apiErrors from "../classes/apiErrors.js"
import bcrypt from "bcrypt"

class UserService {
    static async create(userData) {
        const { cpf, password } = userData;
        const lastThreeDigits = cpf.slice(-3);
        const userFound = await this.checkCPF(cpf, lastThreeDigits);
        
        if (userFound) throw new apiErrors("CPF inválido", 401);
        
        userData.cpf = await bcrypt.hash(cpf, 10);
        userData.password = await bcrypt.hash(password, 10);
        userData.lastThree = lastThreeDigits;

        const newUser = await User.create(userData);
        if (!newUser) throw new apiErrors("Falha ao cadastrar usuário.", 404);

        return newUser;
    }

    static async login(email, password) {
        const foundUser = await User.findOne({ email });
        if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
            throw new apiErrors("Email ou senha inválidos", 401);
        }
        return jwtController.sign(foundUser._id);
    }

    static async loginWithCPF(cpf) {
        console.log(cpf)
        const userFound = await this.checkCPF(cpf, cpf.slice(-3));
        if (!userFound) throw new apiErrors("CPF inválido", 401);
        return jwtController.sign(userFound._id);
    }

    static async getAll() {
        const users = await User.find();
        if (users.length === 0) throw new apiErrors("Não existem usuários cadastrados.", 404);
        return users;
    }

    static async getById(id) {
        const user = await User.findById(id).lean();
        if (!user) throw new apiErrors("Usuário não encontrado.", 404);
        delete user.password;
        return user;
    }

    static async update(id, data) {
        if(data.password) data.password = await bcrypt.hash(data.password, 10);
        const user = await User.findByIdAndUpdate(id, data);
        if (!user) throw new apiErrors("Usuário não encontrado.", 404);
        return user;
    }

    static async delete(id) {
        await Log.deleteMany({ user: id });
        const user = await User.findByIdAndDelete(id);
        if (!user) throw new apiErrors("Usuário não encontrado.", 404);
        await Log.deleteMany({ user: id });
        return user;
    }

    static async checkCPF(cpf, lastThreeDigits) {
        const users = await User.find({ lastThree: { "$regex": `${lastThreeDigits}$` } });
        for (const user of users) {
            if (await bcrypt.compare(cpf, user.cpf)) return user;
        }
        return null;
    }
}

export default UserService;


