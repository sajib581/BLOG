const express = require('express')
const router = express.Router() 
const profileValidator = require('../validator/dashboard/profileValidator')

const {isAuthenticated} = require('../middlewares/authMiddleware')
const { 
    dashBoardGetController,
    createProfileGetController,
    createProfilePostController,
    editProfileGetController,
    editProfilePostController,
    bookmarksGetController,
    commentsGetController
} = require('../controllers/dashBoardController')

router.get('/bookmarks',isAuthenticated,bookmarksGetController)
router.get('/comments',commentsGetController)

router.get('/create-profile',isAuthenticated,createProfileGetController)
router.post('/create-profile',isAuthenticated,profileValidator,createProfilePostController)

router.get('/edit-profile',isAuthenticated,editProfileGetController)
router.post('/edit-profile',isAuthenticated,profileValidator,editProfilePostController)

router.get('/', isAuthenticated ,dashBoardGetController)

module.exports = router 

