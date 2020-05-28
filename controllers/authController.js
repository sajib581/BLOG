const User = require("../models/User") ;
const bcrypt = require('bcrypt') ;
const {validationResult} = require('express-validator')
const errorFormatter = require('../utills/validationErrorFormater')
const Flash = require('../utills/Flash')

exports.signupGetController = (req,res,next) =>{
    if(req.session.isLoggedIn){
        return res.redirect('/dashboard')
    }

    res.render('pages/auths/signup',
    {
        title : 'Create a new account' ,
        error : {} , 
        value : {} ,
        flashMessage : Flash.getMessage(req)        
    })
 
}

exports.signupPostController =async(req,res,next) =>{

    let errors = validationResult(req).formatWith(errorFormatter)
    
    let {username,email,password} = req.body

    
    if(!errors.isEmpty()){
       req.flash('fail','Please check your form')       
       return res.render('pages/auths/signup',
       {
           title : 'Create a new account' ,
           error : errors.mapped(),
           value :{username,email,password},
           flashMessage : Flash.getMessage(req)      
        })
        
    }
    
    try {
        let hashPassword = await bcrypt.hash(password,11) 

    let user = new User({
        username,
        email,
        password : hashPassword 
    })

        let createUser = await user.save()
        req.flash('success','User Created Successfully')
        res.redirect('/auth/login')
    } catch (e) {
        next(e)
    }
    
}

exports.loginGetController = (req,res,next) =>{
    //console.log(req.session);                                       

    if(req.session.isLoggedIn){
        return res.redirect('/dashboard')
    }
    
    res.render('pages/auths/login',
    {
        title : 'Log in your account', 
        error : {},
        flashMessage : Flash.getMessage(req)        
    } )
}
exports.loginPostController =async (req,res,next) =>{
    let {email,password} = req.body
    
    let errors = validationResult(req).formatWith(errorFormatter)

    if(!errors.isEmpty()){
        req.flash('fail','Please check your form')        
       return res.render('pages/auths/login',
       {
           title : 'Login your account' ,
           error : errors.mapped(),
           flashMessage : Flash.getMessage(req)         
        })
        
    }
    
    try {
        const userData =await User.findOne({email})
        
        if(!userData){
            req.flash('fail','User not found try with another email or sign up')   /////////////////////////////////////////////////////////
            return res.render('pages/auths/login',
            {
                title : 'Login your account' ,
                error : {},
                flashMessage : Flash.getMessage(req)       
        })
           
        }
        passCheck =await bcrypt.compare(password,userData.password)
        if(!passCheck){
            req.flash('fail','Password does not match')        
            return res.render('pages/auths/login',
            {
                title : 'Login your account' ,
                error : {},
                flashMessage : Flash.getMessage(req)         
        })
        }
        req.session.isLoggedIn = true   
        req.session.user = userData     

        req.session.save(err =>{
            if(err){
                console.log(err);
                return next(err)
            }
            req.flash('success','Successfully Loged In')
            res.redirect('/dashboard')
        })


    } catch (e) {
        next(e)        
    }
}

exports.logoutController = (req,res,next) =>{
    //req.flash('success','Successfully Log out')
    req.session.destroy(err =>{
        if (err) {
            console.log(err);
            return next(err)
        }
        //req.flash('success','Successfully Logout')
        
        return res.redirect('/auth/login')

    })
}

exports.changePasswordGetController = async (req,res,next) => {
    res.render('pages/auths/changePassword',{
        title : "Change My Password" ,
        flashMessage : Flash.getMessage(req),
        error : {}
    })
}

exports.changePasswordPostController = async (req,res,next) => {

    let {oldPassword,newPassword,confirmPassword} = req.body

    let errors = validationResult(req).formatWith(errorFormatter)       

    if(!errors.isEmpty()){
        req.flash('fail','Please check your form')        
       return res.render('pages/auths/changePassword',
       {
           title : 'Change My Password' ,
           error : errors.mapped(),
           flashMessage : Flash.getMessage(req)         
        })        
    }    

    if(newPassword != confirmPassword){
        req.flash('fail','Password Does not Match')
        return res.redirect('/auth/change-password')
    }
    try {
        let match = await bcrypt.compare(oldPassword,req.user.password)
        if(!match){
            req.flash('fail',"Invalid Old Pasword")
            return res.redirect('/auth/change-password')
        }
        let hash = await bcrypt.hash(newPassword,11)
        await User.findOneAndUpdate(
            {_id : req.user._id},
            {$set : {password : hash}}
        )

        req.flash('success','Password Updated Successfully')
        return res.redirect('/auth/change-password')

    } catch (e) {
       next(e) 
    }    
}