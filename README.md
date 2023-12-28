# BackendAbrazaGalicia

# Install

npm i  --> instala libraries

node db/initDB.js  -->  Iniciar base de dados

npm run dev  --> iniciar servidor 


Rutas de usuario:
POST / --> Registro de usuario
POST /login --> Login de usuario
PUT /user/update/:id --> Modificar el usuario
GET /user/:id --> listar el usuario por id
GET /users --> listar los usuarios
DELETE /user/delete/:id --> Elimina el producto

Rutas de posts:
GET /posts --> Muestra todos los productos
GET /posts/:id --> Selecciona el producto por el id
POST /post/:id --> Crea un nuevo producto
DELETE /posts/:id --> Elimina el producto

