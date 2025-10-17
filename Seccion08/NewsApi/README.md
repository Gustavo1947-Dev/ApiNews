# Documentación Técnica: API de Noticias

## 1. Introducción y Contexto

Este proyecto es una API RESTful desarrollada con Node.js y Express.js, diseñada para gestionar un sistema de noticias. Su función principal es servir como backend para una aplicación de noticias, permitiendo la creación, gestión y consulta de artículos, categorías, usuarios y otros recursos relacionados. El objetivo es proporcionar una base de datos centralizada y una lógica de negocio sólida a través de una interfaz API bien definida.

## 2. Sistema de Autenticación y Autorización (Auth)

El sistema de autenticación es una pieza clave de la API, diseñado para proteger las rutas y gestionar el acceso de los usuarios a los diferentes recursos. Se basa en el uso de JSON Web Tokens (JWT) y se compone de varios módulos que trabajan en conjunto.

### Flujo de Autenticación

1.  **Registro de Usuarios**: Un nuevo usuario se registra proporcionando sus datos personales (nombre, correo, contraseña, etc.). El sistema valida que los datos sean correctos y, crucialmente, verifica que el correo electrónico no esté ya en uso por otro usuario para garantizar la unicidad.

2.  **Inicio de Sesión (Login)**: El usuario envía sus credenciales (correo y contraseña). El sistema verifica que estas sean correctas. Si la autenticación es exitosa, la API genera un **JSON Web Token (JWT)**. Este token contiene información del usuario (como su ID y su rol) y se firma digitalmente para asegurar su integridad.

3.  **Acceso a Rutas Protegidas**: Una vez que el usuario tiene un token, debe incluirlo en las cabeceras de cada petición a las rutas protegidas.

### Componentes del Sistema de Auth

*   **Rutas de Autenticación (`/routes/AuthRoute.js`)**:
    *   **Función**: Define los endpoints o URLs para el registro (`/auth/registro`) y el inicio de sesión (`/auth/login`).
    *   **Operación**: Asocia cada ruta con una serie de validaciones y una función específica del controlador que se encargará de procesar la petición.

*   **Validadores (`/validators/AuthValidator.js`)**:
    *   **Función**: Antes de procesar un registro o un inicio de sesión, estos validadores utilizan `express-validator` para asegurar que los datos enviados por el cliente cumplan con las reglas de negocio.
    *   **Operación**: Verifican que los campos no estén vacíos, que el correo tenga un formato válido y que las contraseñas cumplan con la longitud mínima. Para el registro, realizan una consulta a la base de datos para confirmar que el correo no exista previamente.

*   **Controlador de Autenticación (`/controllers/AuthController.js`)**:
    *   **Función**: Contiene la lógica principal para el registro e inicio de sesión.
    *   **Operación de Registro**: Si los datos son válidos, crea un nuevo usuario en la base de datos con un perfil de usuario estándar.
    *   **Operación de Login**: Comprueba las credenciales del usuario contra la base de datos. Si son correctas, genera un JWT que se envía de vuelta al usuario para que pueda usarlo en futuras peticiones.

*   **Middlewares de JWT (`/middlewares/jwt.js`)**:
    *   **Función**: Actúan como guardianes de las rutas de la API. Interceptan cada petición a un endpoint protegido para verificar la validez del JWT.
    *   **Operación**: Decodifican el token enviado por el cliente y comprueban su firma. Si el token es válido, permiten que la petición continúe hacia el controlador correspondiente. Si no es válido (o no se proporciona), bloquean el acceso y devuelven un error de "No autorizado".
    *   **Niveles de Acceso**: El sistema define diferentes middlewares para distintos niveles de autorización. Por ejemplo, `authenticateAny` permite el acceso a cualquier usuario autenticado, mientras que otros middlewares (como `authenticateAdmin`) restringen el acceso solo a usuarios con un perfil específico, como "Administrador".

## 3. Ecosistema Tecnológico

El proyecto se apoya en un conjunto de tecnologías clave del ecosistema de Node.js para construir una API robusta y mantenible.

*   **Framework Principal**: **Express.js**, utilizado como el framework de servidor web para la construcción de la API RESTful.
*   **Base de Datos**: **MySQL**, como sistema de gestión de bases de datos relacional.
*   **Librerías Clave de Terceros**:
    *   **Sequelize**: Un ORM (Object-Relational Mapper) que facilita la interacción con la base de datos MySQL, permitiendo definir modelos y relaciones con objetos de JavaScript.
    *   **mysql2**: Driver de MySQL para Node.js, utilizado por Sequelize para comunicarse eficientemente con la base de datos.
    *   **express-validator**: Middleware para la validación de los datos de entrada en las rutas de Express.js.
    *   **jsonwebtoken**: Librería para la generación y verificación de JSON Web Tokens (JWT) para la autenticación.