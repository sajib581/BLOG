const express = require('express')
const morgan = require('morgan')
const session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash')  
const config = require('config')

const {bindUserWithRequest} = require('./authMiddleware')
const setLocals = require('./setLocals')

//const MONGODB_URI =process.env.DB_LINK ;
const MONGODB_URI =config.get('my-db') ; 

const store = new MongoDBStore({   //it's related with mongodb-session
    uri: MONGODB_URI,
    collection: 'sessions',
    expires : 1000*60*60*2
  })

const middleware=[
    morgan('dev'),
    express.urlencoded({extended:true}),
    express.json(),
    express.static('public'),
    session({
        
        secret : config.get('secret') ,
        resave : false,
        saveUninitialized : false,
        store : store
    }), 
    flash(),
    bindUserWithRequest() ,
    setLocals()
    
]

module.exports = app =>{
    middleware.forEach(m =>{
        app.use(m)
    })
}