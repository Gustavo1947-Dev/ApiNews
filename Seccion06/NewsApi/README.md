# Documentación Técnica: API de Noticias

## 1. Introducción y Contexto

Este proyecto es una API RESTful desarrollada con Node.js y Express.js, diseñada para gestionar un sistema de noticias. Su función principal es servir como backend para una aplicación de noticias, permitiendo la creación, gestión y consulta de artículos, categorías, usuarios y otros recursos relacionados. El objetivo es proporcionar una base de datos centralizada y una lógica de negocio sólida a través de una interfaz API bien definida.

<!-- Sugerencia de imagen: Diagrama de arquitectura de alto nivel que muestre la relación entre el cliente (frontend), la API (backend) y la base de datos. -->

## 2. Estructura de Carpetas

-   `/controllers`: **(Foco Principal)** Contiene la lógica que maneja las peticiones (requests) y respuestas (responses) de la API.
-   `/models`: Define la estructura de los datos (esquemas de tablas) usando el ORM Sequelize.
-   `/routes`: Define las rutas (endpoints) de la API y las asocia con las funciones de los controladores.
-   `app.js`: Punto de entrada principal que inicializa el servidor Express y configura la aplicación.

## 3. Análisis Detallado de Controladores

Los controladores son el núcleo de la lógica de la API. Cada uno se encarga de gestionar un recurso específico, interactuando con los modelos de datos para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) y construyendo la respuesta que se enviará al cliente.

### `NewController.js`

*   **Propósito**: Gestiona todo lo relacionado con el recurso **Noticia** (`New`).
*   **Funciones Esenciales**:
    *   `get`: Obtiene una lista de noticias, con opción de filtrar por `titulo` y `activo`.
    *   `getById`: Obtiene una noticia específica por su `id`.
    *   `create`: Crea una nueva noticia a partir de los datos del `body` de la petición.
    *   `update`: Actualiza una noticia existente.
    *   `destroy`: Elimina una noticia.
*   **Relaciones**:
    *   Interactúa directamente con el modelo `New` para las operaciones principales.
    *   Define una constante `relations` para incluir modelos asociados en las consultas. Al obtener una noticia, también trae consigo los datos de su `Category`, `State` y `User` (incluyendo el `Profile` del usuario). Esto enriquece la respuesta y evita consultas adicionales desde el cliente.
*   **Características (Request/Response)**:
    *   **Request**: Utiliza `req.query` para filtros, `req.params` para identificar recursos por ID y `req.body` para la creación y actualización de datos.
    *   **Procesamiento**: Construye un objeto de filtros y lo pasa a los métodos de Sequelize (`findAll`, `findByPk`). Utiliza la opción `include` con la constante `relations` para cargar los datos anidados.
    *   **Response**: Devuelve respuestas en formato JSON con los datos solicitados (`response.json()`) y utiliza códigos de estado HTTP estándar (200, 201, 404, 500) para comunicar el resultado de la operación.

<!-- Sugerencia de imagen: Captura de pantalla de una prueba de API (usando Postman o similar) a la ruta GET /api/noticias/1, mostrando la respuesta JSON con los datos de la noticia y sus relaciones (categoría, estado, usuario). -->

### `UserController.js`

*   **Propósito**: Gestiona el recurso **Usuario** (`User`).
*   **Funciones Esenciales**: Implementa las operaciones CRUD estándar (`get`, `getById`, `create`, `update`, `destroy`) para los usuarios.
*   **Relaciones**:
    *   Su modelo principal de interacción es `User`.
    *   Al igual que `NewController`, define `relations` para incluir el `Profile` asociado a cada usuario en las consultas, especificando los atributos a mostrar (`id`, `nombre`).
*   **Características (Request/Response)**:
    *   **Request**: Recibe filtros por `nombre`, `apellidos` y `nick` a través de `req.query`.
    *   **Procesamiento**: Realiza consultas a la base de datos utilizando los modelos de Sequelize, aplicando filtros y la inclusión del perfil.
    *   **Response**: Retorna listas de usuarios o un usuario específico en formato JSON. Para `update` y `destroy`, devuelve un mensaje de texto confirmando el número de registros afectados.

<!-- Sugerencia de imagen: Fragmento de código del `UserController.js` mostrando la constante `relations` y su uso en la función `get`. -->

```javascript
// Ejemplo de relations en UserController.js
const relations = [
    { model: Profile, attributes: ['id', 'nombre'], as: 'perfil' }
]

// ...

User.findAll({
    where: filters,
    include: relations
})
```

### `CategoryController.js`

*   **Propósito**: Administra el recurso **Categoría** (`Category`).
*   **Funciones Esenciales**: Provee los endpoints para el CRUD de categorías.
*   **Relaciones**:
    *   Interactúa con el modelo `Category`.
    *   Define `relations` para que, al consultar una categoría, se incluyan todas las **noticias** (`New`) asociadas a ella. Además, dentro de cada noticia, incluye su **estado** (`State`).
*   **Características (Request/Response)**:
    *   **Request**: Acepta filtros por `nombre`, `descripcion`, `activo` y `useralta` en `req.query`.
    *   **Procesamiento**: Utiliza `findAll` y `findByPk` con la opción `include` para traer las categorías junto con sus noticias correspondientes.
    *   **Response**: Devuelve los datos de las categorías y sus noticias anidadas en formato JSON.

### `StateController.js`

*   **Propósito**: Gestiona el recurso **Estado** (`State`), que define el ciclo de vida de una noticia (ej. "Publicada", "Borrador").
*   **Funciones Esenciales**: Implementa el CRUD para los estados.
*   **Relaciones**:
    *   Su modelo principal es `State`.
    *   En las consultas, incluye las **noticias** (`New`) que se encuentran en cada estado, junto con el **usuario** (`User`) que creó cada noticia.
*   **Características (Request/Response)**:
    *   **Request**: Acepta filtros por `nombre` y `abreviacion`. Utiliza `express-validator` en las rutas de creación y actualización para validar los datos de entrada. Si la validación falla, devuelve un error 422.
    *   **Procesamiento**: Construye los filtros y los pasa a los métodos de Sequelize, incluyendo las relaciones anidadas.
    *   **Response**: Si la validación es incorrecta, responde con un objeto de errores. Para consultas exitosas, devuelve los estados con sus noticias asociadas.

<!-- Sugerencia de imagen: Captura de pantalla de una prueba de API a la ruta GET /api/estados, mostrando un estado y la lista de "noticias" anidadas. -->

### `ProfileController.js`

*   **Propósito**: Administra los **Perfiles** (`Profile`) o roles de los usuarios (ej. "Administrador", "Periodista").
*   **Funciones Esenciales**: Provee los endpoints para el CRUD de perfiles.
*   **Relaciones**:
    *   Interactúa con el modelo `Profile`.
    *   Al consultar un perfil, incluye una lista de todos los **usuarios** (`User`) que tienen asignado dicho perfil.
*   **Características (Request/Response)**:
    *   **Request**: Permite filtrar perfiles por `nombre` a través de `req.query`.
    *   **Procesamiento**: Realiza las consultas a la base de datos incluyendo la relación con los usuarios.
    *   **Response**: Devuelve los perfiles y la lista de usuarios asociados en formato JSON.

<!-- Sugerencia de imagen: Fragmento de código de `ProfileController.js` mostrando cómo se define la relación para incluir los usuarios. -->

```javascript
// Ejemplo de relations en ProfileController.js
const relations = [
    { model: User, as: 'usuarios', attributes: ['id', 'nick', 'nombre', 'correo'] }
]

// ...

Profile.findByPk(id, {
    include: relations
})
```

## 4. Ecosistema Tecnológico y Conclusión

El proyecto se apoya en un conjunto de tecnologías clave del ecosistema de Node.js para construir una API robusta y mantenible.

*   **Framework Principal**: **Express.js**, utilizado como el framework de servidor web para la construcción de la API RESTful.
*   **Base de Datos**: **MySQL**, como sistema de gestión de bases de datos relacional.
*   **Librerías Clave de Terceros**:
    *   **Sequelize**: Un ORM (Object-Relational Mapper) que facilita la interacción con la base de datos MySQL, permitiendo definir modelos y relaciones con objetos de JavaScript.
    *   **mysql2**: Driver de MySQL para Node.js, utilizado por Sequelize para comunicarse eficientemente con la base de datos.
    *   **express-validator**: Middleware para la validación de los datos de entrada en las rutas de Express.js.

En conclusión, los controladores de esta API están diseñados para ser el punto central de la lógica de negocio, manejando las peticiones, interactuando con la capa de datos a través de Sequelize y construyendo respuestas JSON enriquecidas gracias a la carga de relaciones.

<!-- Sugerencia de imagen: Captura de pantalla de una consulta exitosa a la API desde un cliente o una vista previa del frontend consumiendo los datos. -->
