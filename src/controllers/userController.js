import UserService from "../services/userService.js";

const userController = {
    create: async (req, res) => {
        try {
            const user = await UserService.createUser(req.body);
            res.status(201).json({ message: "Usuário criado com sucesso!"});
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const token = await UserService.loginUser(req.body.email, req.body.password);
            res.json({ auth: true, token });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    loginCPF: async (req, res) => {
        try {
            const token = await UserService.loginWithCPF(req.params.cpf);
            res.json({ auth: true, token });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    list: async (req, res) => {
        try {
            const users = await UserService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    listOne: async (req, res) => {
        try {
            const user = await UserService.getUserById(req.params.id);
            res.json(user);
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const user = await UserService.updateUser(req.params.id, req.body);
            res.json({ message: "Usuário atualizado com sucesso!", user });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await UserService.deleteUser(req.params.id);
            res.json({ message: "Usuário e seus logs deletados com sucesso!" });
        } catch (error) {
            res.status(error.statusCode || 500).json({ message: error.message });
        }
    },
};

export default userController;
