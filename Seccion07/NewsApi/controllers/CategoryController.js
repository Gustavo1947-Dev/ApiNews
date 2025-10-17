const { Category } = require('../models/CategoryModel');
const { New } = require('../models/NewModel');
const { State } = require('../models/StateModel');
const { validationResult } = require('express-validator');
const { User } = require('../models/UserModel');

// --- INICIO DE LA CORRECCIÓN ---
// Definir la relación que falta: Una categoría tiene muchas noticias.
// Sequelize necesita conocer ambos lados de la asociación para hacer el 'include'.
Category.hasMany(New, { as: 'noticias', foreignKey: 'categoria_id' });
// --- FIN DE LA CORRECCIÓN ---
const relations = [
    {
        model: New, as: 'noticias', attributes: ['id', 'titulo', 'descripcion', 'fecha_publicacion'], include: [
            { model: State, as: 'estado', attributes: ['id', 'nombre'] }
        ]
    }
]

const get = async (request, response) => {
    try {
        const { nombre, descripcion, activo, useralta } = request.query;
        const filters = { ...nombre && { nombre }, ...descripcion && { descripcion }, ...activo && { activo }, ...useralta && { useralta } };
        const entities = await Category.findAll({
            where: filters,
            include: relations
        });
        response.json(entities);
    } catch (err) {
        console.log(err);
        response.status(500).send('Error consultando los datos');
    }
}

const getById = async (request, response) => {
    try {
        const id = request.params.id;
        const entitie = await Category.findByPk(id, {
            include: relations
        });
        if (entitie) {
            response.json(entitie);
        } else {
            response.status(404).send('Recurso no encontrado');
        }
    } catch (err) {
        console.log(err);
        response.status(500).send('Error al consultar el dato');
    }
}

const create = async (request, response) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.mapped() });
        }
        const newEntitie = await Category.create(request.body);
        response.status(201).json(newEntitie);
    } catch (err) {
        console.log(err);
        response.status(500).send('Error al crear');
    }
}

const update = async (request, response) => {
    try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.mapped() });
        }
        const id = request.params.id;
        const [numRowsUpdated] = await Category.update(request.body, {
            where: {
                id: id
            }
        });
        response.status(200).send(`${numRowsUpdated} registro actualizado`);
    } catch (err) {
        console.log(err);
        response.status(500).send('Error al actualizar');
    }
}

const destroy = async (request, response) => {
    try {
        const id = request.params.id;
        const numRowsDeleted = await Category.destroy({
            where: {
                id: id
            }
        });
        response.status(200).send(`${numRowsDeleted} registro eliminado`);
    } catch (err) {
        console.log(err);
        response.status(500).send('Error al eliminar');
    }
}

module.exports = {
    get,
    getById,
    create,
    update,
    destroy
};