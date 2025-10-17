const express = require('express')
const app = express();
require('dotenv').config(); // Cargar variables de entorno al inicio de la app
const PORT = 3000

app.use(express.json());

//Exportar Rutas
const profile_routes = require('./routes/ProfileRoute');
const state_routes = require('./routes/StateRoute');
const category_routes = require('./routes/CategoryRoute');
const new_routes = require('./routes/NewRoute');
const user_routes = require('./routes/UserRoute');
const auth_routes = require('./routes/AuthRoute')



//Usar las rutas
app.use('/api/auth', auth_routes);
app.use('/api', profile_routes);
app.use('/api', state_routes);
app.use('/api', category_routes);
app.use('/api', new_routes);
app.use('/api', user_routes);

app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ' + PORT);
});

module.exports = app;