const Joi = require('joi')

const newUserSchema = Joi.object({
    email: Joi.string()
    .email()
    .message("email must be a valid ")
    .min(4)
    .message("email must has at least 4 digits")
    .max(100)
    .message("email must has not exceed 100 digits")
    .required(),
    name: Joi.string()
    .min(3)
    .message("name must has at least 4 digits")
    .max(100)
    .message("name must has not exceed 100 digits")
    .required(),
    password: Joi.string()
    .min(4)
    .message("password must has at least 4 digits")
    .max(50)
    .message("password must has not exceed 50 digits")
    .required(),
    address: Joi.string()
    .min(4)
    .message("at least 4 digits")
    .max(300)
    .message("not exceed 50 digits")
    .required()
    
}) 


module.exports =  { newUserSchema }