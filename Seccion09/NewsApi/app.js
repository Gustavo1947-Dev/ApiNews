const express = require('express')
const app = express();
const cors = require('cors');
const { PORT } = require("./config");

app.use(cors());

app.use(express.json({ limit: '50mb' }))

//Exportar Rutas
const profile_routes = require('./routes/ProfileRoute');
const state_routes = require('./routes/StateRoute');
const category_routes = require('./routes/CategoryRoute');
const new_routes = require('./routes/NewRoute');
const user_routes = require('./routes/UserRoute');
const auth_routes = require('./routes/AuthRoute');



//Usar las rutas
app.use('/api', profile_routes, state_routes, category_routes, new_routes, user_routes, auth_routes)

app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ' + PORT);
});

module.exports = app;