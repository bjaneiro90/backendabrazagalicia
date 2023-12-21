const { generateError } = require("../helpers");
const jwt = require('jsonwebtoken')

const authUser =  async (req, res, next) => {
    try {
   
       const { authorization } = req.headers;
       if(!authorization) {
        throw generateError('Authorization is missing')
       }

       let token

       try {
        token = jwt.verify(authorization, process.env.SECRET)
       } catch {
        throw generateError('Incorrect Token')
       }
       
       req.userId = token.id;

       next()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    authUser
}