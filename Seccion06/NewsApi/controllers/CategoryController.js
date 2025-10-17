const { Category } = require('../models/CategoryModel');
const { New } = require('../models/NewModel');
const { State } = require('../models/StateModel');
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

const get = (request, response) => {
    const { nombre, descripcion, activo, useralta } = request.query
    const filters = {}
    if (nombre) {
        filters.nombre = nombre
    }
    if (descripcion) {
        filters.descripcion = descripcion
    }
    if (activo) {
        filters.activo = activo
    }
    if (useralta) {
        filters.useralta = useralta
    }

    //const filters = request.query
    Category.findAll({
        where: filters,
        include: relations
    })
        .then(entities => {
            response.json(entities);
        })
        .catch(err => {
            console.log(err)
            response.status(500).send('Error consultando los datos');
        })

}

const getById = (request, response) => {
    const id = request.params.id;
    Category.findByPk(id, {
        include: relations
    })
        .then(entitie => {
            if (entitie) {
                response.json(entitie);
            }
            else {
                response.status(404).send('Recurso no encontrado')
            }
        })
        .catch(err => {
            response.status(500).send('Error al consultar el dato');
        })
}


const create = (request, response) => {

    Category.create(request.body).then(
        newEntitie => {
            response.status(201).json(newEntitie)
        }
    )
        .catch(err => {
            response.status(500).send('Error al crear');
        })
}

const update = (request, response) => {
    const id = request.params.id;
    Category.update(
        request.body
        ,
        {
            where: {
                id: id
            }
        })
        .then(numRowsUpdated => {
            response.status(200).send(`${numRowsUpdated} registro actualizado`);
        })
        .catch(err => {
            response.status(500).send('Error al actualizar');
        });
}


const destroy = (request, response) => {
    const id = request.params.id;
    Category.destroy(
        {
            where: {
                id: id
            }
        }
    ).then(numRowsDeleted => {
        response.status(200).send(`${numRowsDeleted} registro eliminado`);
    })
        .catch(err => {
            response.status(500).send('Error al eliminar');
        });
}

module.exports = {
    get,
    getById,
    create,
    update,
    destroy
};