const Sequelize = require('sequelize')


const connection = new Sequelize('db_news', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
})


connection.authenticate()
    .then(() => {
        console.log('Se ha establecido conexión con la base de datos')
    })
    .catch(err => {
        console.log('No se pudo establecer conexión con la base de datos')
    })

module.exports = { connection };