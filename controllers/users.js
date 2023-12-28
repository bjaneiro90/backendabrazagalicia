const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {generateError, createPathIfNotExists} = require('../helpers')
const {newUserSchema }  = require("../schemas/users/newUser")
const { createUser, getUserById, getUserByEmail, getAllUsers, deleteUser, editUser } = require("../db/queries/users")
const { logInSchema } = require('../schemas/users/logIn')
const path = require('path')
const sharp = require('sharp')
const {nanoid} = require('nanoid')
const {sendMail} = require('../SendMail')
const { getConnection } = require('../db/db')


 const newUserController = async (req, res, next) => {
     try {
         await newUserSchema.validateAsync(req.body)

        
        const { email, name , password, address} = req.body

        
        let imageFileName;
        
        if (req.files && req.files.avatar) {
           const uploadsDir = path.join(__dirname, '../uploads');
           
           await createPathIfNotExists(uploadsDir)
           
           const image = sharp(req.files.avatar.data)
           image.resize(1000)

           imageFileName = `${nanoid(24)}.png`

           await image.toFile(path.join(uploadsDir, imageFileName))
        }

        const id = await createUser(email, name, password, imageFileName, address)

        const user = await getUserById(id)



         await sendMail({
             recipient: user.email, 
             subject:"Registration Completed",
             content: `<h1>Welcome ${user.name}!</h1><p> Enjoy our app!</p>`
             })
    
       

        res.send({
            status: 'ok',
            data: user
        })

    }   catch (error) {
        next(error)
    }
 }



 const getUserController = async (req, res, next) =>{
    try {
        const {id} = req.params

       const user = await getUserById(id)
        res.send({
            status: 'ok',
            data: user
        })
    } catch (error) {
        next(error)
    }
 }



 const getAllUsersController = async (req,res,next) => {
    try {
        const users = await getAllUsers()

        res.send({
            status: 'ok',
            data: users
        })
    } catch (error) {
       next(error)
    }

 }



 const loginController = async (req, res, next) => {
    try {

        await logInSchema.validateAsync(req.body)

        const { email, password } = req.body

        const user = await getUserByEmail(email)
        
        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword) {
            throw generateError("Password doesn't match", 401)
        }

        const payload = { id: user.id}

        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: '30d',
        })
        

        res.send({
            status: 'ok',
            data: token
        })
    }   catch (error) {
        next(error)
    }
 }



const editUserController = async (req,res,next) => {
    let connection
    try {
        connection = await getConnection()

        let imageFileName;


        if (req.files && req.files.avatar) {
            const uploadsDir = path.join(__dirname, '../uploads');
            
            await createPathIfNotExists(uploadsDir)
            
            const image = sharp(req.files.avatar.data)
            image.resize(1000)
 
            imageFileName = `${nanoid(24)}.png`
 
            await image.toFile(path.join(uploadsDir, imageFileName))
         }

         
         let { email, name, password, avatar=imageFileName, address } = req.body
         
         const { id } = req.params
         const user_id = req.userId
         console.log(id)
         console.log(user_id)

         const [[result]] = await connection.query(`
            SELECT id, email, name, password, avatar, address 
            FROM users
            WHERE id = ?
         `,
         [id]
         )
         console.log(result)

         if (!result) {
            throw generateError("This user doesn't exist", 404)
         }

         if (user_id !== result.id) {
            throw generateError("Not allowed to modify this user", 401)
         }

         await connection.query(`
            UPDATE users SET email=?, name=?, password=?, avatar=?, address=?
            WHERE id = ? 
         `,
         [
            email || result.email,
            name || result.name,
            password || result.password,
            avatar || result.avatar,
            address || result.address,
            id
         ])

         res.send({
            status: "ok",
            message: "user modified",
            data: {
                id,
                email,
                name,
                password,
                avatar,
                address,
            }
         })


        
    } catch (error) {
        next(error)
    } finally {
        if (connection) connection.release()
    }
}

 

 const deleteUserController = async (req, res, next) => {
    try {
        
        const {id} = req.params
    
    
        await deleteUser(id)
    
        res.send({
            status: "ok",
            message: `User con id: ${id} fue borrado`
        })
    } catch (error) {
     next(error)
    }
 }

 module.exports = {
    newUserController,
    getUserController,
    loginController,
    getAllUsersController,
    deleteUserController,
    editUserController
 }