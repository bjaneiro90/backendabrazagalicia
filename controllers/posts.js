const getConnection = require('../db/db')

const getPostsController = async (req, res, next) => {
    try {
        res.send({
            status: 'error',
            message: 'Not implemented'
        })
    }   catch (error) {
        next(error)
    }
}

const newPostController = async (req, res, next) => {
    console.log('usuario:', req.userId)
    try {
        res.send({
            status: 'ok',
            message: 'New Post Added'
        })
    }   catch (error) {
        next(error)
    }
}

const getIDController = async (req, res, next) => {
    try {
        res.send({
            status: 'error',
            message: 'Not implemented'
        })
    }   catch (error) {
        next(error)
    }
}

const deletePostController = async (req, res, next) => {
    try {
        res.send({
            status: 'error',
            message: 'Not implemented'
        })
    }   catch (error) {
        next(error)
    }
}


const editPostController= async (req, res, next) => {
    try {
        res.send({
            status: 'error',
            message: 'Not implemented'
        })
    }   catch (error) {
        next(error)
    }
}

module.exports = {
    getPostsController,
    newPostController,
    getIDController,
    deletePostController,
    editPostController
}