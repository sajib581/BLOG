const User = require('../models/User')
const Post = require('../models/Post')
const Flash = require('../utills/Flash')

exports.authorProfileGetController = async (req,res,next) => {

    let userId = req.params.userId
    try {
        let author = await User.findById(userId)
            .populate({
                path : 'profile' ,    //all profile is populated except ref
                populate : {
                    path : 'posts'
                }
            })
        let posts = author.profile.posts 
        
        res.render('pages/explorer/author',{
            title : 'Author Page',
            flashMessage : Flash.getMessage(req),
            author,
            posts
        })

    } catch (e) {
        next(e)
    }

    
}