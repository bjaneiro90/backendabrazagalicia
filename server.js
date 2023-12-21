require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')

const {
    newUserController,
    loginController,
    getUserController,
} = require('./controllers/users');

const {
    getPostsController,
    newPostController,
    getIDController,
    deletePostController,
    editPostController
} = require('./controllers/posts')

const { authUser } = require ('./middlewares/auth')

const app = express();

app.use(fileUpload())
app.use(express.json())
app.use(morgan('dev'));
app.use('/uploads',express.static('./uploads'))


//Rutas de usuário
app.post('/user', newUserController);
app.get('/user/:id', getUserController);
app.post('/login', loginController)


// Rutas de Localization



//Rutas de posts
app.post('/posts', authUser, newPostController)
app.get('/posts', getPostsController)
app.get('/post/:id', getIDController)
app.delete('/post/:id', deletePostController)
app.put('/post/:id', editPostController)


// Middlewares: 
//error 404
app.use((req,res) => {
    res.status(404)
    .send({
        status: 'error',
        message: 'Not Found'
    })
})


// Gestion de errores
app.use((error, req, res, next) => {
    console.error(error);

    res.status(error.httpStatus || 500)
    .send({
        status: 'error',
        message: error.message
    })
});


app.listen(3000, () => {
    console.log('Servidor funcionando!')
})