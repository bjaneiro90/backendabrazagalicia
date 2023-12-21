const bcrypt = require('bcrypt')
const { generateError } = require('../../helpers');
const { getConnection } = require('../db')


const getUserByEmail = async (email) => {
    let connection
    
    try {
        connection = await getConnection()

        const [result] = await connection.query(`
            SELECT * FROM users WHERE email=?
        `,
        [email])

        if(result.length === 0) {
            throw generateError("Doesn't exist any user with this email", 404)
        }

        return result[0]

    } finally {
        if (connection) connection.release()
    }
}



const getUserById = async (id) => {
    let connection
    
    try {
        connection = await getConnection()

        const [result] = await connection.query(`
            SELECT id, email, name, avatar, address FROM users WHERE id=?
        `,
        [id])

        if(result.length === 0) {
            throw generateError("Doesn't exist any user with this id", 404)
        }

        return result[0]

    } finally {
        if (connection) connection.release()
    }
}

const createUser = async (email, name, password, avatar, address) => {
    let connection

    try {
        connection = await getConnection()

        const [user] = await connection.query(
        `
        SELECT id FROM users WHERE email = ?
        `,
        [email]
        );

        if (user.length > 0) {
            throw generateError('Already exists a user with this e-mail', 409)
        }

        const passwordHash = await bcrypt.hash(password, 8)


        const [newUser] = await connection.query(`
            INSERT INTO users (email, name, password, avatar, address) VALUES (?, ?, ?, ?, ?)
        `,
        [email, name, passwordHash, avatar, address])

        return newUser.insertId

    }  finally {
        if(connection) connection.release()
    }
}

module.exports = {
    createUser,
    getUserById,
    getUserByEmail
}