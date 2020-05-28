const {body} = require('express-validator')
const validator = require('validator')

const linkValidator = value =>{
    if(value){
        if(!validator.isURL(value)){
            throw new Error('Please provide valid URL')
        }
    }
    return true 
}

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name can not be empty')
        .isLength({max : 50 }).withMessage('Name can not be more than 50 chracters')
        .trim()
    ,
    body('title')
        .not().isEmpty().withMessage('Title can not be empty')
        .isLength({max : 100 }).withMessage('Title can not be more than 100 chracters')
        .trim()
        ,
    body('bio')
        .not().isEmpty().withMessage('Bio can not be empty')
        .isLength({max : 500 }).withMessage('Bio can not be more than 500 chracters')
        .trim()
    ,
    body('website')
        .custom(linkValidator)
    ,
    body('facebook')
        .custom(linkValidator)
    ,
    body('github')
        .custom(linkValidator)
    ,
    body('twitter')
        .custom(linkValidator)
    
    ]