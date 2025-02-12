import jwt from "jsonwebtoken"
import apiErrors from "../classes/apiErrors.js";

const jwtController = {
    // verifyJWT(req, res){
    //     try {
    //         const token = req.headers['authorization'];
    //         console.log("linha7");
    
    //         if (!token) {
    //             console.log("linha9");
    //             return { success: false, message: 'No token provided.' };
    //         }
    
    //         console.log("linha9");
    
    //         // Retornando uma Promise para garantir controle assíncrono
    //         return new Promise((resolve, reject) => {
    //             jwt.verify(token, process.env.SECRET, function(err, decoded) {
    //                 if (err) {
    //                     console.log("linha12");
    //                     return reject({ success: false, message: 'Failed to authenticate token.' });
    //                 }
    
    //                 console.log("linha13");
    //                 return resolve({ success: true, message: 'Token autenticado com sucesso.' });
    //             });
    //         });
    
    //     } catch (error) {
    //         console.log("linha22");
    //         return { success: false, message: `Falha na autenticação do token: ${error.message}` };
    //     }
    // },

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