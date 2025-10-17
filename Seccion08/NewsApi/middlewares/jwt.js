const jwt = require('jsonwebtoken');
require('dotenv').config();


const authenticateAdmin = (req, res, next) => {
    const authorization_header = req.headers.authorization;
    const token = authorization_header && authorization_header.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'No se proporcionó un token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Sin autorización' });
        }
        req.user = decoded.usuario; // Adjuntamos el payload del usuario al request
        if (decoded.usuario.perfil_id === 1) {
            next();
        }
        else { // Si el usuario no es administrador
            return res.status(403).send({ message: 'Sin autorización' });
        }

    });
}

const authenticateAny = (req, res, next) => {
    const authorization_header = req.headers.authorization;
    const token = authorization_header && authorization_header.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: 'No se proporcionó un token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'Sin autorización' });
        }
        req.user = decoded.usuario; // Adjuntamos el payload del usuario al request
        next();
    });
}


module.exports = {
    authenticateAdmin,
    authenticateAny
};