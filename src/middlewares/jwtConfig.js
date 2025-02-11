import jwt from "jsonwebtoken"

const jwtController = {
    verifyJWT(req, res){
        try{
            const token = req.headers['authorization'];
            if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
            
            jwt.verify(token, process.env.SECRET, function(err, decoded) {
                try{
                    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
                    return true;
                } catch (error) {
                    return res.status(500).json({ auth: false, message: 'falha na autenticação do token.' })
                }
            });
        } catch (error){
            res.status(error.statusCode || 500).json({ message: `falha na autenticação do token: ${error.message}`});
        }
    },

    sign(id){
        const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 3000
        });
        return token
    }
}

export default jwtController