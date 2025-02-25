import { User } from "../models/User.js"
import { Log } from "../models/Log.js"
import { jwtController } from "../middlewares/jwtConfig.js"
import apiErrors from "../classes/apiErrors.js"
import bcrypt from "bcrypt"
import nodemailer from "nodemailer"
import bodyParser from "body-parser"

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
        const foundUser = await this.checkCPF(cpf, cpf.slice(-3));
        if (!foundUser) throw new apiErrors("CPF inválido", 401);
        return ["token: " + jwtController.sign(foundUser._id), "user: "+foundUser._id];
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

    static async forgotPassword(email) {
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            throw new apiErrors("Email não encontrado", 404);
        }

        const token = crypto.randomBytes(20).toString('hex');
        foundUser.resetToken = token; 
        await foundUser.save();

        await this.sendEmail(email, token);
        return "Verifique seu email para alterar a senha";
    }

    static async getResetPassword(token) {
        const user = await User.findOne({ resetToken: token });
        if (user) {
            return '<form method="post" action="/reset-password"><input type="password" name="password" required><input type="submit" value="Reset Password"></form>';
        } else {
            throw new apiErrors("Invalid or expired token", 404);
        }
    }

    static async resetPassword(token, data) {
        const user = await User.findOne({ resetToken: token });
        if (user) {
            user.password = await bcrypt.hash(data.password, 10);
            user.resetToken = undefined;
            await user.save();
            return "Senha alterada com sucesso!";
        } else {
            throw new apiErrors("token inválido ou expirado", 404);
        }
    }

    static async sendEmail(email, token) {
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password',
        },
        });
        const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`,
        };
    }
}

export default UserService;


