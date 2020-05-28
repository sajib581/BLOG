//user,tittle,bio,profilePic,links : {fb,tw},bookmarks

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const Post = require('./Post')
// const User = require('./User')

const profileSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    name : {
        type : String,
        required : true,
        trim : true,
        maxlength: 50
    },
    title :{
        type : String,
        require : true ,
        trim :true,
        maxlength : 100
    },
    bio : {
        type : String,
        require : true ,
        trim : true,
        maxlength : 500
    },
    profilePics : String,
    links : {
        website : String,
        facebook : String,
        twitter : String ,
        github : String
    },
    posts : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Post'
        }
    ],
    bookmarks : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Post'
        }
    ]

},{timestamps : true})

const Profile = mongoose.model('Profile',profileSchema)

module.exports = Profile