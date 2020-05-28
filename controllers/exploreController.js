const Profile = require('../models/Profile')
const Post = require('../models/Post')
const Flash = require('../utills/Flash')

const moment = require('moment')

function genDate(days){
    let date = moment().subtract(days,'days')
    //console.log(date);
    //console.log(date.toDate());
    return date.toDate()  // as we need iso formatted date
}

function generateFilterObject(filter){
    let filterobj = {} 
    let order = 1

    switch (filter){
        case  'week' : {
            filterobj = {
                createdAt : {
                    $gt : genDate(7)
                }
            }                        
            order = -1
            break 
        }
        case  'month' : {
            filterobj = {
                createdAt : {
                    $gt : genDate(30)
                }
            }
            order = -1
            break 
        }
        case 'all' : {
            order = -1 
            break 
        }
    }
    return {
        filterobj ,
        order 
    }
}


exports.exploreGetController =async (req,res,next) => {

    let filter = req.query.filter || 'latest'
    let currentPage = parseInt(req.query.page) || 1
    let itemPerPage = 4
        
    let {order,filterobj} = generateFilterObject(filter.toLowerCase())
    
    try {
        let posts = await Post.find(filterobj)        
            .populate('author','username')                 // 1st e path bolte hoy pore ki select korbo
            .sort(order == 1 ? '-createdAt': 'createdAt')  //1 hole Decending naile assending
            .skip((itemPerPage*currentPage)-itemPerPage)
            .limit(itemPerPage )
        let totalPost = await Post.countDocuments()
        let totalPages = totalPost/itemPerPage
        
        let totalPage = Math.ceil(totalPages)
        
        let bookmarks = []

        if(req.user){
            let profile = await Profile.findOne({user : req.user._id})
            if(profile){
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/explorer',{
            title : 'Explore All Post',
            filter ,
            flashMessage : Flash.getMessage(req),
            posts,
            itemPerPage,
            totalPage,
            currentPage,
            bookmarks
        })
    } catch (e) {
        next(e)
    }
    
}

exports.singlePostGetController = async (req,res,next) => {
    let { postId } = req.params

    try {
        let post = await Post.findById(postId)
        .populate('author','username profilePics')
        .populate({
            path : 'comments' ,  //must modal name
            populate : {
                path : 'user' ,
                select: 'username profilePics'
            }
        })
        .populate({
            path : 'comments',  //must modal
            populate : {
                path: 'replies.user',   //replies is error not havin reply modal
                select : 'username profilePics'
            }

        })
        if(!post){
            let error = new Error('404 Page not found')
            error.status = 404
            throw error
        }
        let bookmarks = []
        if(req.user){
            let profile = await Profile.findOne({user : req.user._id})
            if(profile){
                bookmarks = profile.bookmarks
            }
        }

        res.render('pages/explorer/singlePage',{
            title : post.title ,
            flashMessage : Flash.getMessage(req),
            post,
            bookmarks
        })

    } catch (e) {
        
    }
}