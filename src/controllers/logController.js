import LogService from "../services/logService.js";

const logController = {
    create: async (req, res) => {
        try {
            await LogService.createLog(req.body);
            res.status(201).json({ msg: "Log criado com sucesso!" });
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    },

    list: async (req, res) => {
        try {
            const logs = await LogService.listLogsByUser(req.params.id);
            res.json(logs);
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    },

    listByCode: async (req, res) => {
        try {
            const log = await LogService.findLogByCode(req.params.code);
            res.json(log);
        } catch (error) {
            res.status(error.statusCode || 400).json({ message: error.message });
        }
    }
};

export default logController;
