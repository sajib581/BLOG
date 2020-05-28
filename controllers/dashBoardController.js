const {validationResult} = require('express-validator')
const errorFormatter = require('../utills/validationErrorFormater')

const Flash = require('../utills/Flash')
const Profile = require('../models/Profile')
const User = require('../models/User')
const Comment = require('../models/Comment')

exports.dashBoardGetController=async(req,res,next)=>{

    try {
        let profile =await Profile.findOne({user : req.user._id})
        .populate({
            path : 'posts',
            select : 'title thumbnail'
        })
        .populate({
            path : 'bookmarks',
            select : 'title thumbnail'
        })
        console.log(profile)
        
        if(profile){
            return res.render('pages/dashboard/dashboard',
            {
                title : 'My Dashboard' ,
                flashMessage : Flash.getMessage(req) ,
                posts : profile.posts.reverse().slice(0,3) ,
                bookmarks : profile.bookmarks.reverse().slice(0,3)
            })
        }
        res.redirect('/dashboard/create-profile')
    } catch (error) {
        next(error)
    }
    
}

exports.createProfileGetController = async(req,res,next) => {
    try {
        let profile =await Profile.findOne({user : req.user._id})

        if(profile){
            return res.redirect('/dashboard/edit-profile')
        }
        res.render('pages/dashboard/create-profile',
            {
                title : 'Create your profile' ,
                flashMessage : Flash.getMessage(req) ,
                error : {}
            })
        
    } catch (e) {
        next(e)
    }
}

exports.createProfilePostController =async (req,res,next) => {
    let errors = validationResult(req).formatWith(errorFormatter)
    //console.log(errors.mapped());

    if(!errors.isEmpty()){
        req.flash('fail','Please provide valid data')
        return res.render('pages/dashboard/create-profile',
        {
            title : 'Create your profile' ,
            flashMessage : Flash.getMessage(req) ,
            error : errors.mapped()
        })
    }

    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
     } = req.body

    //let profilePics = req.user.profilePics
     try {
         let profile= new Profile({
             user : req.user._id ,
             name,
             title,
             bio,
             profilePics : req.user.profilePics,
             links : {
                 website:website || '',
                 facebook : facebook || '' ,
                 twitter : twitter || '' ,
                 github : github || ''
             },
             posts : [],
             bookmarks : [] 
         })
         let createProfile =await profile.save()
         await User.findOneAndUpdate(
             {_id : req.user._id},
             {$set : {profile : createProfile._id}}
            )
            req.flash('success','Profile Created Successfully')
            res.redirect('/dashboard')

     } catch (e) {
         next(e)
     }
     
    
    
}

exports.editProfileGetController =async (req,res,next) => {
    let profile = await Profile.findOne({user : req.user._id})

    if(!profile){
        return res.redirect('/dashboard/create-profile')
    }
    res.render('pages/dashboard/edit-profile',
        {
            title : 'Edit your profile' ,
            flashMessage : Flash.getMessage(req) ,
            error : {},
            profile
        })
}

exports.editProfilePostController =async (req,res,next) => {
    let errors = validationResult(req).formatWith(errorFormatter)
    //console.log(errors.mapped());

    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter,
        github
     } = req.body

    if(!errors.isEmpty()){
        req.flash('fail','Please provide valid data')
        return res.render('pages/dashboard/create-profile',
        {
            title : 'Create your profile' ,
            flashMessage : Flash.getMessage(req) ,
            error : errors.mapped(),
            profile : {
                name,
                title,
                bio,
                links : {
                    website,
                    facebook,
                    twitter,
                    github
                }
            }
        })
    }
    try {
        let profile = {
            name,
            title,
            bio,
            links : {
                website:website || '',
                facebook : facebook || '' ,
                twitter : twitter || '' ,
                github : github || ''
            }
        }
        let updatedProfile = await Profile.findOneAndUpdate(
            { user : req.user._id},
            { $set : profile}, 
            { new : true}
        )
        
        req.flash('success','Profile Updated Successfully')
        res.render('pages/dashboard/edit-profile',{
            title : 'Edit your profile' ,
            error : {},
            flashMessage : Flash.getMessage(req) ,            
            profile 
        })

    } catch (e) {
                
        next(e) 
    }
}

exports.bookmarksGetController =async (req,res,next) =>{
    try {
        let profile = await Profile.findOne({ user : req.user._id})
            .populate({
                path : 'bookmarks',
                //model : 'Post',
                select : 'title thumbnail'
            })
            //res.json(profile)
            console.log(profile)            
        res.render('pages/dashboard/bookmarks',{
            title : 'My Bookmarks' ,
            flashMessage : Flash.getMessage(req),
            posts : profile.bookmarks
        })
    } catch (e) {
       next(e) 
    }
}

exports.commentsGetController =async (req,res,next) =>{
    try {
        let profile = await Profile.findOne({ user : req.user._id})
        let comments = await Comment.find({ post : { $in: profile.posts} })
            .populate({
                path : 'post' ,
                select : 'title'
            })
            .populate({
                path : 'user' ,
                select : 'username profilePics'
            })
            .populate({
                path : 'replies.user',
                select : 'username profilePics'
            })

        //res.json(comments)
        res.render('pages/dashboard/comments',{
            title : "My Recent Comments" ,
            flashMessage : Flash.getMessage(req),
            comments
        })

    } catch (e) {
        next(e)
    }
}

