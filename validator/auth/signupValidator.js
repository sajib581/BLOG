const User = require('../../models/User')
const {body} = require('express-validator')

module.exports  = [
    body('username')
    .not()
    .isEmpty()
    .withMessage("Username can not be empty")
    .isLength({max : 15,min : 2})
    .withMessage("Username must betwen 2-15 characters")
    .custom(async username => {
        let user =await User.findOne({username})
        if(user){
            
            //throw new Error("This Username is already used")
            return Promise.reject('This Username is already used')
        }
    })
    .trim() ,
    body('email')
    .isEmail()
    .withMessage("Enter a valid email address")
    .custom(async email => {
        let user =await User.findOne({email})
        if(user){
            return Promise.reject('This email is already used') 
            //throw new Error("This email is already used")
        }
    })
    .normalizeEmail(),
    body('password')
    .isLength({min : 8})
    .withMessage("Password should be minimum 8 characters")
    ,
    body('confirmPassword')
    .custom((confirmPassword,{req})=>{
        if(confirmPassword!=req.body.password){
            throw new Error("Password does not match")
        }
        return true
    })

]