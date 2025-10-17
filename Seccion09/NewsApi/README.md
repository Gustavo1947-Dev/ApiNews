# Documentación Técnica: API de Noticias - Gestión de CORS

## 1. Introducción y Contexto

Este proyecto es una API RESTful desarrollada con Node.js y Express.js, diseñada para servir como el backend de una aplicación de noticias. Una de las configuraciones más importantes para que esta API pueda ser consumida por una aplicación cliente (frontend) que se ejecuta en un navegador web es la política de **Intercambio de Recursos de Origen Cruzado (CORS)**.

Este documento se enfoca en explicar cómo funciona CORS y su importancia en el contexto de esta API.

## 2. ¿Qué es CORS y por qué es importante?

CORS (Cross-Origin Resource Sharing) es un mecanismo de seguridad implementado por los navegadores web. Su propósito es controlar qué aplicaciones web (identificadas por su "origen") tienen permiso para solicitar recursos a un servidor que se encuentra en un origen diferente.

Un "origen" está compuesto por el protocolo (ej. `http`), el dominio (ej. `mi-frontend.com`) и el puerto (ej. `8080`). Si alguno de estos tres elementos es diferente entre el cliente y el servidor, el navegador considera que la solicitud es de "origen cruzado".

**Importancia para esta API:**
Nuestra API de Noticias reside en un origen (ej. `http://localhost:3000`) y está diseñada para ser consumida por una aplicación de frontend que probablemente se ejecutará en otro (ej. `http://localhost:8080` o `https://mi-portal-de-noticias.com`). Sin una configuración CORS adecuada, el navegador del usuario final bloquearía todas las peticiones del frontend a la API, impidiendo que la aplicación funcione.

CORS permite que nuestro servidor le "diga" al navegador que confía en ciertos orígenes y que les permite acceder a sus recursos.

## 3. ¿Cómo funciona el flujo de CORS?

El mecanismo de CORS se basa en un intercambio de cabeceras HTTP entre el navegador del cliente y el servidor de la API.
Src.
### a. Solicitudes Simples

Para solicitudes consideradas "simples" (como un `GET` o `POST` con cabeceras estándar), el flujo es directo:
1.  El navegador envía la solicitud al servidor, incluyendo una cabecera `Origin` que indica desde dónde se origina la petición (ej. `Origin: https://mi-frontend.com`).
2.  El servidor de la API recibe la solicitud, revisa la cabecera `Origin` y decide si ese origen está permitido.
3.  Si el origen está permitido, el servidor procesa la solicitud y, en su respuesta, incluye la cabecera `Access-Control-Allow-Origin` con el valor del origen que autorizó (ej. `Access-Control-Allow-Origin: https://mi-frontend.com`).
4.  El navegador recibe la respuesta. Si la cabecera `Access-Control-Allow-Origin` coincide con el origen del frontend (o es un comodín `*`), permite que la aplicación cliente acceda a los datos. Si no, bloquea la respuesta y muestra un error de CORS en la consola.

### b. Solicitudes de Comprobación Previa (Preflight)

Para solicitudes más complejas (ej. `PUT`, `DELETE`, o si se incluyen cabeceras personalizadas como `Authorization` para tokens), el navegador realiza una comprobación previa antes de enviar la solicitud real.

1.  **Solicitud Preflight**: Antes de la petición principal, el navegador envía automáticamente una solicitud con el método `OPTIONS` a la misma URL. Esta solicitud "pregunta" al servidor si la petición real que está por venir será aceptada. Incluye cabeceras como:
    *   `Origin`: El origen del cliente.
    *   `Access-Control-Request-Method`: El método HTTP que se usará en la solicitud real (ej. `PUT`).
    *   `Access-Control-Request-Headers`: Las cabeceras que se incluirán (ej. `Content-Type`, `Authorization`).

2.  **Respuesta del Servidor a Preflight**: El servidor de la API no ejecuta la lógica del endpoint, sino que responde a la solicitud `OPTIONS` con un conjunto de cabeceras CORS que definen sus políticas:
    *   `Access-Control-Allow-Origin`: Indica qué origen está permitido.
    *   `Access-Control-Allow-Methods`: Lista los métodos HTTP permitidos (ej. `GET, POST, PUT, DELETE`).
    *   `Access-Control-Allow-Headers`: Lista las cabeceras personalizadas permitidas.
    *   `Access-Control-Max-Age`: (Opcional) Indica por cuántos segundos el navegador puede cachear el resultado de esta comprobación previa.
Src.
3.  **Decisión del Navegador**: El navegador analiza la respuesta a la solicitud `OPTIONS`. Si los métodos y cabeceras de la solicitud real están permitidos por el servidor, procede a enviar la solicitud principal (ej. el `PUT` con los datos). Si no, detiene el proceso y muestra un error de CORS.

## 4. Configuración de CORS en la API de Noticias

En este proyecto, la configuración de CORS se gestiona de forma centralizada, típicamente en el archivo de entrada de la aplicación (`app.js`). Se utiliza un middleware de Express para interceptar todas las solicitudes entrantes y añadir las cabeceras de respuesta CORS necesarias.

La configuración puede ser:
*   **Permisiva (para desarrollo)**: Se puede configurar para aceptar solicitudes desde cualquier origen (`*`). Esto es útil durante el desarrollo para evitar problemas de configuración.
*   **Restrictiva (para producción)**: Es la práctica recomendada. Se define una "lista blanca" de orígenes específicos que tienen permiso para acceder a la API. Por ejemplo, solo se permitirían solicitudes desde `https://mi-portal-de-noticias.com`.

Para mantener la flexibilidad entre entornos, la lista de orígenes permitidos se puede gestionar a través de variables de entorno en un archivo `.env`, en lugar de dejarla fija en el código.
Src.

