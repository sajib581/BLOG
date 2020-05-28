require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose');
const config = require('config')
const chalk = require('chalk')

//Import Middlewares
const setMiddleware = require('./middlewares/middleware')

//Import Routes
const setRoutes = require('./routes/routes')

const MONGODB_URI =config.get('my-db') ;  

const app = express() 


//Setup view Engine
app.set('view engine','ejs')
app.set('views','views')

//using Middleware from middleware directory
setMiddleware(app)

//Using routes from Route Directory
setRoutes(app)

app.use((res,req,next)=>{
    let error = new Error('404 page not found')
    error.status = 404
    next(error)
})
app.use((error,req,res,next)=>{
    if(error.status==404){
        return res.render('pages/errors/404',{flashMessage : {} ,title : '404 not found'} )
    }
    console.log(error)
    return res.render('pages/errors/500',{flashMessage : {}  } )
})

// app.use('/',(req,res)=>{
//     res.render('pages/errors/404',{flashMessage : {} } )
// })

const PORT = 3000

mongoose.connect(MONGODB_URI , {useNewUrlParser: true, useUnifiedTopology: true}) //jate console kono error nah ase
.then(
    app.listen(PORT,()=>{
        console.log(chalk.green('Database Connected'));
        
        console.log(chalk.green(`your server is ready on port ${PORT}`))  ;
    })
)
.catch(err =>{
    console.log(err)
})
