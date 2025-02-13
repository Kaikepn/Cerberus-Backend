import jwt from "jsonwebtoken"
import apiErrors from "../classes/apiErrors.js";

const jwtController = {
    sign(id){
        const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 3000
        });
        return token
    }
}

const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ auth: false, message: 'Token não foi fornecido.' });
    }
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) {
            return res.status(401).json({ auth: false, message: 'Falha ao autenticar o token.' });
        }
        req.userId = decoded.id;
        next();
    });
};


export { jwtController, verifyJWT }