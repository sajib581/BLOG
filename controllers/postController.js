const {validationResult} = require('express-validator')
const errorFormatter = require('../utills/validationErrorFormater')
const readingTime = require('reading-time')

const Flash = require('../utills/Flash')

const Post = require('../models/Post')
const Profile = require('../models/Profile')

exports.createPostGetController = (req,res,next) => {
    res.render('pages/dashboard/post/createPost',{
        title : 'Create a new post',
        error : {},
        flashMessage : Flash.getMessage(req),
        value : {}
    })
}

exports.createPostPostController =async (req,res,next) => {
    let {title,body,tags} = req.body  

    let errors = validationResult(req).formatWith(errorFormatter)
    //console.log(errors.mapped());

    if(!errors.isEmpty()){
        req.flash('fail','Please provide valid data')
        return res.render('pages/dashboard/post/createPost',
        {
            title : 'Create your Post' ,
            flashMessage : Flash.getMessage(req) ,
            error : errors.mapped(),            
            value : {
                title,
                body,
                tags
            }
        })
    }

    if(tags){
        tags=tags.split(',')
        tags = tags.map(t => t.trim())
    }

    let readTime = readingTime(body).text

    let post = new Post({
        title,
        body,
        tags,
        author : req.user._id ,
        thumbnail : '' ,
        readTime,
        likes : [],
        dislikes : [] ,
        comments : []
    })
    if(req.file){
        post.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
        let createdPost = await post.save()
        await Profile.findOneAndUpdate(
            {user : req.user._id},
            {$push : {'posts' : createdPost._id}}
        )
        req.flash('Post Created Successfully')
        res.redirect(`/posts/edit/${createdPost._id}`)
    } catch (e) {
        next(e)
    }

}

exports.editPostGetController =async (req,res,next) => {
    let postId = req.params.postId

    try {
        let post =await Post.findOne({author : req.user._id , _id : postId})     
        
        if(!post){
            let error = new Error('404 Page not found')
            error.status = 404
            throw error
        }
        res.render('pages/dashboard/post/editPost',{
            title : 'edit your post',
            error: {} ,
            flashMessage : Flash.getMessage(req),
            post
        })

    } catch (e) {
        next(e)
    }

}

exports.editPostPostController =async (req,res,next) => {
    let {title,body,tags} = req.body
    let postId = req.params.postId
    let errors = validationResult(req).formatWith(errorFormatter)
    
    try {
        let post =await Post.findOne({author : req.user._id , _id : postId})            
        
        if(!post){
            let error = new Error('404 Page not found')
            error.status = 404
            throw error
        }
    
    if(!errors.isEmpty()){
        req.flash('fail','Please provide valid data')
        res.render('pages/dashboard/post/editPost',
        {
            title : 'Edit your Post' ,
            flashMessage : Flash.getMessage(req) ,
            error : errors.mapped(),            
            post
        })
    }

    if(tags){
        tags=tags.split(',')
        tags = tags.map(t => t.trim())
    }
    let thumbnail = post.thumbnail
    if(req.file){
        thumbnail = `/uploads/${req.file.filename}`
        //thumbnail = req.file.filename
        console.log(thumbnail)        
        
    }
    await Post.findOneAndUpdate(
        {_id : post._id},
        {$set : {title,body,tags,thumbnail } } ,
        {new : true}
    )
    req.flash('success','Post Updated Successfully')
    res.redirect('/posts/edit/'+post._id)

    } catch (e) {
        next(e)
    }
    
}

exports.DeletePostGetController =async (req,res,next) => {
        
    //let {postId} = req.params
    let postId = req.params.postId

    try {
        let post =await Post.findOne({author : req.user._id , _id : postId})            
        
        if(!post){
            let error = new Error('404 Page not found')
            error.status = 404
            throw error
        }

        await Post.findOneAndDelete({_id : postId})
        await Profile.findOneAndUpdate(
            {user : req.user._id},
            {$pull : {"posts" : postId}}
        )

        req.flash('success',"Post Delete Successfully")
        res.redirect('/posts')
    } catch (e) {
        
    }
}

exports.alPostGetController =async (req,res,next) => {
    try {
        let posts = await Post.find({author : req.user._id})
        res.render('pages/dashboard/post/posts',{
            title : 'My Created Post',
            flashMessage : Flash.getMessage(req),
            posts
        })
    } catch (e) {
        
    }
}