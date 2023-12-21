require('dotenv').config();

const { getConnection } = require('./db');

async function main() {
    let connection;

    try {
        connection = await getConnection();

        console.log('Borando tablas existentes')

        await connection.query('DROP TABLE IF EXISTS posts')

        await connection.query('DROP TABLE IF EXISTS users')
        
        console.log('Creando tablas')

        await connection.query(`
            CREATE TABLE users (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                name VARCHAR(100) NOT NULL,
                avatar VARCHAR(100),
                address VARCHAR(300) NOT NULL, 
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP()
                );
        `);

        await connection.query(`
            CREATE TABLE posts (
                id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                user_id INT UNSIGNED NOT NULL,
                title VARCHAR(100) NOT NULL,
                text VARCHAR(500) NOT NULL,
                creationDate DATETIME DEFAULT CURRENT_TIMESTAMP(),
                FOREIGN KEY (user_id) REFERENCES users(id)
                );
        `);
    } catch (error) {
       console.log(error) 
    } finally { 
        if(connection) connection.release()
        process.exit()
    }
}

main();