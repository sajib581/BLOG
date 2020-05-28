//Name,email,Password,Profile
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const Profile = require('./Profile')

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        trim:true,
        maxlength: 15
        
    },
    email : {
        type : String,
        required : true,
        trim:true,
    },
    password:{
        type : String,
        required : true
    },
    profile : {
        type: Schema.Types.ObjectId ,
        ref : 'Profile'  //ref dui vabe kora jay 1.eivabe 2 pointing kore
    },
    profilePics : {
        type : String,
        default : '/uploads/default.png'
    }
}
,{timestamps: true}
)

const User = mongoose.model("User",userSchema)

module.exports = User 