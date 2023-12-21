const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {generateError, createPathIfNotExists} = require('../helpers')
const {newUserSchema }  = require("../schemas/users/newUser")
const { createUser, getUserById, getUserByEmail } = require("../db/queries/users")
const { logInSchema } = require('../schemas/users/logIn')
const path = require('path')
const sharp = require('sharp')
const {nanoid} = require('nanoid')
const {sendMail} = require('../SendMail')

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

 module.exports = {
    newUserController,
    getUserController,
    loginController
 }