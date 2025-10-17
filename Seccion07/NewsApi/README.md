# Documentación Técnica: API de Noticias

## 1. Introducción y Contexto

Este proyecto es una API RESTful desarrollada con Node.js y Express.js, diseñada para gestionar un sistema de noticias. Su función principal es servir como backend para una aplicación de noticias, permitiendo la creación, gestión y consulta de artículos, categorías, usuarios y otros recursos relacionados. El objetivo es proporcionar una base de datos centralizada y una lógica de negocio sólida a través de una interfaz API bien definida.

## 2. Estructura de Carpetas

-   `/controllers`: **(Foco Principal)** Contiene la lógica que maneja las peticiones (requests) y respuestas (responses) de la API.
-   `/models`: Define la estructura de los datos (esquemas de tablas) usando el ORM Sequelize.
-   `/routes`: Define las rutas (endpoints) de la API y las asocia con las funciones de los controladores.
-   `/validators`: Contiene las reglas de validación para los datos de entrada de la API.
-   `app.js`: Punto de entrada principal que inicializa el servidor Express y configura la aplicación.

## 3. Ecosistema Tecnológico

El proyecto se apoya en un conjunto de tecnologías clave del ecosistema de Node.js para construir una API robusta y mantenible.

*   **Framework Principal**: **Express.js**, utilizado como el framework de servidor web para la construcción de la API RESTful.
*   **Base de Datos**: **MySQL**, como sistema de gestión de bases de datos relacional.
*   **Librerías Clave de Terceros**:
    *   **Sequelize**: Un ORM (Object-Relational Mapper) que facilita la interacción con la base de datos MySQL, permitiendo definir modelos y relaciones con objetos de JavaScript.
    *   **mysql2**: Driver de MySQL para Node.js, utilizado por Sequelize para comunicarse eficientemente con la base de datos.
    *   **express-validator**: Middleware para la validación de los datos de entrada en las rutas de Express.js.

## 4. Sistema de Validación de Datos

La integridad y seguridad de los datos son fundamentales en esta API. Para garantizar que solo la información válida y segura se procese y almacene, el proyecto implementa un robusto sistema de validación basado en la librería `express-validator`.

### Propósito

El objetivo principal del sistema de validación es interceptar y verificar todos los datos de entrada (`body`, `params`, `query`) antes de que lleguen a la lógica de negocio en los controladores. Esto previene errores comunes, ataques (como inyección de datos) y asegura que la base de datos mantenga su consistencia.

### Mecanismo de Funcionamiento

El proceso de validación sigue un flujo claro y desacoplado:

1.  **Definición de Reglas**: Las reglas de validación se definen en archivos dedicados dentro de la carpeta `/validators`. Cada archivo (ej. `NewValidator.js`) agrupa las reglas para un recurso específico (ej. "Noticias"). Estas reglas especifican qué se espera de cada campo: si es obligatorio, si debe ser un correo electrónico, si tiene una longitud mínima, etc.

2.  **Integración como Middleware**: Las reglas de validación se integran en el sistema de rutas (`/routes`) como `middlewares`. Un middleware es una función que se ejecuta *antes* que la función principal del controlador. Esto significa que, para una ruta de creación de noticias, primero se ejecutan las validaciones y solo si estas son exitosas, se procede a ejecutar la lógica para crear la noticia.

3.  **Ejecución en el Controlador**: Dentro de la función del controlador (ej. `create` en `NewController.js`), la primera acción es invocar a `validationResult(request)`. Esta función, provista por `express-validator`, revisa la petición y recopila todos los errores de validación que se encontraron en el paso anterior.

4.  **Respuesta al Cliente**:
    *   **Si hay errores**: Si se encontraron errores de validación, el controlador detiene la ejecución y envía inmediatamente una respuesta al cliente con el código de estado **`422 Unprocessable Entity`**. El cuerpo de esta respuesta es un objeto JSON que detalla cada campo que falló la validación y el motivo del error. Esto permite que el frontend pueda mostrar mensajes claros al usuario (ej. "El campo 'correo' no es un email válido").
    *   **Si no hay errores**: Si no se encontraron errores, el flujo de ejecución continúa con normalidad, permitiendo que la lógica del controlador interactúe con la base de datos para crear, actualizar o procesar la información.

### Tipos de Validaciones Implementadas

La API utiliza una variedad de validaciones para asegurar la calidad de los datos, entre las que se incluyen:

*   **Existencia**: Comprueba que los campos requeridos no estén vacíos (`notEmpty`).
*   **Formato**: Verifica que los datos cumplan con un formato específico, como el de un correo electrónico (`isEmail`) o una fecha (`isDate`).
*   **Tipo de Dato**: Asegura que un campo sea numérico (`isNumeric`) o booleano (`isBoolean`).
*   **Longitud**: Controla que el texto tenga una longitud mínima o máxima (`isLength`).
*   **Personalizadas**: Se pueden crear validaciones más complejas, como verificar si un `ID` de categoría realmente existe en la base de datos antes de intentar asociarlo a una noticia.

### Validaciones por Entidad

A continuación, se detalla cómo se aplican estas validaciones a las entidades principales de la API.

#### Noticias (`New`)

Las validaciones para las noticias aseguran la integridad de las relaciones y la calidad del contenido.

*   **Al crear una noticia:**
    *   **IDs de Relación (`categoria_id`, `usuario_id`, `estado_id`):** Son campos obligatorios. El sistema verifica que el ID proporcionado sea un número entero y que corresponda a un registro **activo y existente** en su respectiva tabla (`Categories`, `Users`, `States`).
    *   **Contenido (`titulo`, `descripcion`):** Son campos de texto obligatorios y deben tener una longitud mínima para garantizar que no se creen noticias vacías.
    *   **Multimedia (`imagen`):** Es un campo obligatorio que debe estar en formato Base64.
*   **Al actualizar una noticia:**
    *   Todos los campos son **opcionales**. Solo se validarán los campos que se incluyan en la petición.
    *   Si se proporciona un ID de relación, se aplican las mismas reglas de existencia y estado activo que en la creación.
    *   Si se proporcionan campos de contenido, se valida su longitud mínima.

#### Categorías (`Category`)

Para las categorías, las validaciones se centran en asegurar que los nombres y descripciones sean únicos y tengan un formato adecuado.

*   **Al crear una categoría:**
    *   **`nombre` y `descripcion`:** Son campos de texto obligatorios con una longitud específica. Además, el sistema verifica que no exista otra categoría con el mismo nombre o la misma descripción para evitar duplicados.
*   **Al actualizar una categoría:**
    *   Los campos son **opcionales**. Si se envía un nuevo `nombre` o `descripcion`, se vuelve a comprobar que el nuevo valor no esté ya en uso por otra categoría.

#### Usuarios (`User`)

Las validaciones para los usuarios garantizan que la información de registro y actualización sea consistente y única.

*   **Al crear un usuario:**
    *   **Campos de Identificación (`nombre`, `apellidos`, `nick`, `correo`):** Son obligatorios y deben cumplir con restricciones de tipo (texto) y longitud.
    *   **`correo`:** Además de ser obligatorio y tener formato de email válido, el sistema verifica que no exista ya un usuario registrado con la misma dirección de correo electrónico para asegurar la unicidad.
    *   **`contraseña`:** Es obligatoria, debe ser texto y tener una longitud mínima para asegurar una seguridad básica.
    *   **`perfil_id`:** Es obligatorio y debe ser un número entero. Se valida que el ID proporcionado corresponda a un `Profile` existente en la base de datos.
*   **Al actualizar un usuario:**
    *   Todos los campos son **opcionales**. Solo se validarán los campos que se incluyan en la petición.
    *   Si se proporciona un `nombre`, `apellidos` o `nick`, se valida su tipo y longitud.
    *   Si se proporciona un `correo`, se valida su formato y se verifica que, si se cambia, el nuevo correo no esté ya en uso por otro usuario (excluyendo al propio usuario que se está actualizando).
    *   Si se proporciona una `contraseña`, se valida su longitud mínima.
    *   Si se proporciona un `perfil_id`, se valida que sea un número entero y que corresponda a un `Profile` existente.

#### Perfiles (`Profile`)

Las validaciones para los perfiles se aseguran de que los roles de usuario estén bien definidos y no se dupliquen.

*   **Al crear un perfil:**
    *   **`nombre`:** Es un campo de texto obligatorio, con una longitud definida y debe ser **único** en la base de datos para evitar roles duplicados.
*   **Al actualizar un perfil:**
    *   El campo `nombre` es **opcional**. Si se proporciona, el sistema verifica que el nuevo nombre no esté ya en uso por otro perfil.

#### Estados (`State`)

Para los estados, las validaciones garantizan que el ciclo de vida de una noticia sea consistente.

*   **Al crear un estado:**
    *   **`nombre` y `abreviacion`:** Son campos de texto obligatorios, con una longitud específica y deben ser **únicos** para evitar ambigüedades en los estados.
*   **Al actualizar un estado:**
    *   Los campos son **opcionales**. Si se proporciona un nuevo `nombre` o `abreviacion`, se valida que los nuevos valores no estén ya en uso por otro estado.

En conclusión, el sistema de validación está diseñado de forma modular y preventiva, actuando como una barrera de control de calidad que protege la lógica de negocio y la base de datos de información incorrecta o maliciosa.

## 5. Lógica de Controladores y Relaciones

Los controladores son el núcleo de la lógica de la API. Cada uno se encarga de gestionar un recurso específico (Noticias, Usuarios, etc.), interactuando con los modelos de datos para realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) y construyendo la respuesta que se enviará al cliente.

Una característica clave de los controladores es el uso de la funcionalidad `include` de Sequelize para cargar datos relacionados en una sola consulta. Por ejemplo:

*   Al solicitar una **Categoría**, la API no solo devuelve los datos de la categoría, sino que también incluye una lista de todas las **noticias** que pertenecen a ella.
*   Al consultar una **Noticia**, la respuesta JSON se enriquece con la información completa de su **Categoría**, su **Estado** y el **Usuario** que la creó (incluyendo el perfil de dicho usuario).

Este enfoque de "carga ansiosa" (eager loading) es muy eficiente, ya que reduce el número de consultas a la base de datos y simplifica la lógica en el lado del cliente, que recibe toda la información necesaria en una única petición.
