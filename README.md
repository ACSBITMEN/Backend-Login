# Login / Backend

Este es un proyecto de backend para un sistema de autenticación y gestión de usuarios (CRUD) utilizando Node.js, Express, y PostgreSQL. Proporciona endpoints para la autenticación de usuarios (login) y para operaciones CRUD sobre los usuarios.

Este backend proporciona varios endpoints para autenticación y operaciones CRUD de usuarios:

### API "/auth" Rutas de authenticación 

- **POST /auth/login**: Iniciar sesión y obtener un token:
    ```bash
    {
    "username": "exampleuser",
    "password": "password123"
    }
    ```

### API "/user" Rutas de Usuarios

Nota: Solo los usuarios autenticados con el rol de administrador (rol_id = 1) pueden acceder a estas rutas.

- **GET /user**: Obtener todos los usuarios.
- **POST /user**: Crear un nuevo usuario. 
Ejemplo JSON
    ```bash
    {
      "username": "UserPrueba",
      "first_name": "User",
      "last_name": "Prueba",
      "password": "prueba01",
      "email": "testuser@example.com",
      "role_id": 2
    }
    ```

- **PUT /user/#ID**: Actualizar un usuario por ID.
- **DELETE /user/#ID**: Eliminar un usuario por ID.


## Estructura del Proyecto
El proyecto está organizado de la siguiente manera:

(IMG_1)


La estructura de carpetas y archivos está diseñada para seguir las mejores prácticas en el desarrollo de aplicaciones backend con Node.js y Express, promoviendo la separación de responsabilidades y la organización modular del código. 

Cada carpeta tiene una función específica: 

- **config/**: contiene la configuración general de la aplicación, como la configuración de la base de datos.
- **controllers/**: maneja la lógica de negocio y las operaciones específicas para diferentes rutas, separando las funciones de autenticación (authController.js) y de gestión de usuarios (userController.js). 
- **middlewares/**: se encarga de la lógica intermedia, como la autenticación 
(auth.js), que se ejecuta antes de acceder a las rutas protegidas. 
- **models/**: Define la estructura de la base de datos y los modelos utilizados para interactuar con ella.
- **routes/**: Define las rutas de la API y asigna los controladores correspondientes.
- **utils/**: Contiene funciones de utilidad reutilizables, como la generación de claves y el hash de contraseñas, ayudando a evitar la duplicación de código.

Esta estructura hace que el código sea más mantenible y escalable, ya que permite agregar nuevas funcionalidades sin afectar la organización general del proyecto.

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
