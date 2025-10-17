const { User } = require('../models/UserModel')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const login = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    try {
        const usuario = await User.findOne({
            where: {
                correo: request.body.correo,
                activo: true
            }
        });

        if (!usuario) {
            return response.status(401).json({ message: "Credenciales incorrectas" });
        }

        const passwordMatch = await bcrypt.compare(request.body.contraseña, usuario.contraseña);

        if (passwordMatch) {
            const payload = {
                id: usuario.id,
                perfil_id: usuario.perfil_id,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                nick: usuario.nick
            };
            const token = jwt.sign({ usuario: payload }, process.env.JWT_SECRET, { expiresIn: '24h' });
            response.status(200).json({ message: "Login con éxito", token: token });
        } else {
            response.status(401).json({ message: "Credenciales incorrectas" });
        }
    } catch (err) {
        console.error(err);
        response.status(500).send('Error al intentar iniciar sesión');
    }
}


const register = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.mapped() });
    }

    try {
        const hashedPassword = await bcrypt.hash(request.body.contraseña, 10);
        const newUser = await User.create({ ...request.body, contraseña: hashedPassword, perfil_id: 2, activo: true });
        response.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        response.status(500).send('Error al crear el usuario');
    }
}




module.exports = {
    login,
    register,
};