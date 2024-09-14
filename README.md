# Login / Backend

Este es un proyecto de backend para un sistema de autenticación y gestión de usuarios (CRUD) utilizando Node.js, Express, y PostgreSQL. Proporciona endpoints para la autenticación de usuarios (login) y para operaciones CRUD sobre los usuarios.

Este backend proporciona varios endpoints para autenticación y operaciones CRUD de usuarios:

### API / Rutas de authenticación

POST /auth/login: Iniciar sesión y obtener un token
    ```bash
    {
      "username": "exampleuser",
      "password": "password123"
    }
    ```

### API / Rutas de Usuarios

GET /users: Obtener todos los usuarios (solo administradores).
POST /users: Crear un nuevo usuario (solo administradores).
PUT /users/
: Actualizar un usuario por ID (solo administradores).
DELETE /users/
: Eliminar un usuario por ID (solo administradores).

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

(IMG_1)


## Dependencias

Estas son las principales dependencias utilizadas en el proyecto:

- **bcrypt**: Para el hash y la verificación de contraseñas.
- **body-parser**: Middleware para analizar cuerpos de solicitudes HTTP.
- **cors**: Middleware para habilitar CORS (Cross-Origin Resource Sharing).
- **dotenv**: Para cargar variables de entorno desde un archivo `.env`.
- **express**: Framework web para Node.js.
- **express-rate-limit**: Middleware para limitar el número de solicitudes al servidor.
- **jsonwebtoken**: Para crear y verificar tokens JWT.
- **pg**: Cliente para interactuar con una base de datos PostgreSQL.
- **mysql2**: Cliente para interactuar con una base de datos MySQL (opcional).


## Instalación y Ejecución

### Requisitos previos

- Node.js y npm (Node Package Manager) deben estar instalados en tu sistema.
- Una base de datos PostgreSQL (o MySQL si se ajusta la configuración).

### Instrucciones de instalación

1. Clona este repositorio en tu máquina local:
    ```bash
    git clone https://github.com/ACSBITMEN/Login-Backend.git
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd backend
    ```
3. Instala las dependencias:
    ```bash
    npm install
    ```
4. Crea un archivo `.env` en el directorio raíz y configura tus variables de entorno (ver sección de [Variables de Entorno](#variables-de-entorno) para más detalles).

5. Inicia el servidor:
    ```bash
    npm start
    ```

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de la base de datos
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_base_datos

# Puerto del servidor
PORT= 3000 (si se ajusta la configuración).

# Clave secreta para JWT
JWT_SECRET=tuPass_secreta
