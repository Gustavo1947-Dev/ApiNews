const { User } = require('../models/UserModel')
const { Profile } = require('../models/ProfileModel')

const relations = [
    { model: Profile, attributes: ['id', 'nombre'], as: 'perfil' }
]

const get = (request, response) => {
    const { nombre, apellidos, nick } = request.query
    const filters = {}

    if (nombre) {
        filters.nombre = nombre
    }
    if (apellidos) {
        filters.apellidos = apellidos
    }
    if (nick) {
        filters.nick = nick
    }

    User.findAll({
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
    User.findByPk(id, {
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

    User.create(request.body).then(
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
    User.update(
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
    User.destroy(
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