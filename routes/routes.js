const authRoutes = require('./authRoutes')
const dashboardRoutes = require('./dashBoardRoute')
const playground = require('../playground/play')
const uploadroute = require('./uploadRoutes')
const postRoute = require('./postRoute')
const exploreRoute = require('../routes/exploreRoutes')
const searchRoute = require('./searchRoute') 
const authorRoute = require('./authorRoute')

const apiRoutes = require('../api/routes/apiRoute')

const routes = [
    {
        path : '/auth',
        handeler : authRoutes
    },
    {
        path : '/dashboard',
        handeler : dashboardRoutes
    },
    {
        path : '/uploads' ,
        handeler : uploadroute
    },
    {
        path : '/posts',
        handeler : postRoute
    },
    {
        path : '/explorer',
        handeler :exploreRoute
    },
    {
        path : '/author',
        handeler : authorRoute
    },
    {
        path : '/search' ,
        handeler : searchRoute
    },
    {
        path : '/api' ,
        handeler : apiRoutes
    },
    {
        path : '/playground',
        handeler : playground
    },
    {
        path : '/' ,
        handeler : (req,res)=>{
            res.redirect('/explorer')
        }
    }
]

module.exports = app =>{
    routes.forEach( r => {
        if(r.path=='/'){
            app.get(r.path,r.handeler)
        }else{
            app.use(r.path,r.handeler)
        }
        
    })
}