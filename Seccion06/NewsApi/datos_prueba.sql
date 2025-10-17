-- Borra los datos existentes para empezar desde cero (opcional)
-- Desactiva la revisión de claves foráneas para evitar errores al borrar
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE news;
TRUNCATE TABLE categories;
TRUNCATE TABLE states;
TRUNCATE TABLE users;
TRUNCATE TABLE profiles;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Tabla: profiles
-- Perfiles o roles que pueden tener los usuarios.
INSERT INTO `profiles` (`id`, `nombre`, `createdAt`, `updatedAt`) VALUES
(1, 'Administrador', NOW(), NOW()),
(2, 'Periodista', NOW(), NOW()),
(3, 'Editor', NOW(), NOW()),
(4, 'Lector', NOW(), NOW()),
(5, 'Invitado', NOW(), NOW());

-- 2. Tabla: users
-- Usuarios del sistema, cada uno con un perfil asignado.
INSERT INTO `users` (`id`, `perfil_id`, `nombre`, `apellidos`, `nick`, `correo`, `contraseña`, `activo`, `UserAlta`, `FechaAlta`, `UserMod`, `FechaMod`, `UserBaja`, `FechaBaja`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Gustavo', 'Admin', 'gadmin', 'admin@example.com', 'adminpass', 1, 'SYSTEM', NOW(), 'SYSTEM', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(2, 2, 'Ana', 'García', 'agarcia', 'ana.garcia@example.com', 'periodista123', 1, 'gadmin', NOW(), 'gadmin', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(3, 2, 'Carlos', 'Martínez', 'cmartinez', 'carlos.martinez@example.com', 'periodista456', 1, 'gadmin', NOW(), 'gadmin', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(4, 3, 'Laura', 'Rodríguez', 'lrodriguez', 'laura.rodriguez@example.com', 'editor789', 1, 'gadmin', NOW(), 'gadmin', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(5, 4, 'Juan', 'Pérez', 'jperez', 'juan.perez@example.com', 'lectorpass', 0, 'gadmin', NOW(), 'gadmin', NOW(), 'gadmin', NOW(), NOW(), NOW());

-- 3. Tabla: states
-- Posibles estados en los que se puede encontrar una noticia.
INSERT INTO `states` (`id`, `nombre`, `abreviacion`, `activo`, `UserAlta`, `FechaAlta`, `UserMod`, `FechaMod`, `UserBaja`, `FechaBaja`, `createdAt`, `updatedAt`) VALUES
(1, 'Publicada', 'PUB', 1, 'gadmin', NOW(), 'gadmin', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(2, 'Borrador', 'BOR', 1, 'gadmin', NOW(), 'gadmin', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(3, 'En Revisión', 'REV', 1, 'gadmin', NOW(), 'gadmin', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(4, 'Archivada', 'ARC', 1, 'gadmin', NOW(), 'gadmin', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(5, 'Rechazada', 'RECH', 0, 'gadmin', NOW(), 'gadmin', NOW(), 'gadmin', NOW(), NOW(), NOW());

-- 4. Tabla: categories
-- Categorías para clasificar las noticias.
INSERT INTO `categories` (`id`, `nombre`, `descripcion`, `activo`, `UserAlta`, `FechaAlta`, `UserMod`, `FechaMod`, `UserBaja`, `FechaBaja`, `createdAt`, `updatedAt`) VALUES
(1, 'Deportes', 'Noticias sobre eventos deportivos.', 1, 'gadmin', NOW(), 'gadmin', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(2, 'Tecnología', 'Avances y noticias del mundo tech.', 1, 'gadmin', NOW(), 'gadmin', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(3, 'Política', 'Novedades del ámbito político.', 1, 'gadmin', NOW(), 'gadmin', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(4, 'Cultura', 'Arte, música, cine y entretenimiento.', 1, 'gadmin', NOW(), 'gadmin', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(5, 'Ciencia', 'Descubrimientos y avances científicos.', 0, 'gadmin', NOW(), 'gadmin', NOW(), 'gadmin', NOW(), NOW(), NOW());

-- 5. Tabla: news
-- Noticias de ejemplo, creadas por los usuarios Periodistas (2 y 3) y relacionadas con las categorías y estados.
INSERT INTO `news` (`id`, `categoria_id`, `estado_id`, `usuario_id`, `titulo`, `fecha_publicacion`, `descripcion`, `imagen`, `activo`, `UserAlta`, `FechaAlta`, `UserMod`, `FechaMod`, `UserBaja`, `FechaBaja`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 2, 'La gran final del campeonato', '2024-05-20 18:00:00', 'Contenido extendido sobre el partido, con análisis de jugadas, entrevistas y estadísticas completas.', 'imagen_final.jpg', 1, 'agarcia', NOW(), 'lrodriguez', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(2, 2, 1, 2, 'Nuevo gadget revolucionará el mercado', '2024-05-21 09:30:00', 'Análisis a fondo del nuevo gadget, sus especificaciones técnicas, precio y fecha de lanzamiento.', 'imagen_gadget.jpg', 1, 'agarcia', NOW(), 'lrodriguez', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(3, 3, 2, 3, 'Debate sobre la nueva ley económica', '2024-05-22 11:00:00', 'Este es el contenido en borrador de la noticia sobre el debate. Aún falta la confirmación de las fuentes.', 'imagen_ley.jpg', 1, 'cmartinez', NOW(), 'cmartinez', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(4, 4, 3, 3, 'Se inaugura exposición de arte moderno', '2024-05-19 15:00:00', 'Contenido de la noticia sobre la exposición, esperando la aprobación del editor para ser publicada.', 'imagen_arte.jpg', 1, 'cmartinez', NOW(), 'cmartinez', NOW(), '', '1900-01-01 00:00:00', NOW(), NOW()),
(5, 5, 4, 2, 'Descubrimiento clave en la lucha contra el Alzheimer', '2023-10-15 12:00:00', 'Detalles del estudio científico que ha sido archivado por antigüedad, pero que sentó las bases para investigaciones futuras.', 'imagen_ciencia.jpg', 0, 'agarcia', NOW(), 'gadmin', NOW(), 'gadmin', NOW(), NOW(), NOW());
