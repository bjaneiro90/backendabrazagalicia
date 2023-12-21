const Joi = require('joi')

const logInSchema = Joi.object({
    email: Joi.string()
    .email()
    .message("must be a valid e mail")
    .min(4)
    .message("at least 4 digits")
    .max(100)
    .message("not exceed 100 digits")
    .required(),
    password: Joi.string()
    .min(4)
    .message("at least 4 digits")
    .max(50)
    .message("not exceed 50 digits")
    .required(), 
}) 

module.exports =  { logInSchema }