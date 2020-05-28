const router = require('express').Router()
const postValidator = require('../validator/dashboard/post/postValidator')
const {isAuthenticated} = require('../middlewares/authMiddleware')
const upload = require('../middlewares/uploadMiddleware')

const {
    createPostGetController,
    createPostPostController,
    editPostGetController,
    editPostPostController,
    DeletePostGetController,
    alPostGetController
} = require('../controllers/postController')

router.get('/create',isAuthenticated,createPostGetController)
router.post('/create',isAuthenticated,upload.single('post-thumbnail'),postValidator,createPostPostController)

router.get('/edit/:postId',isAuthenticated,editPostGetController)
router.post('/edit/:postId',isAuthenticated,upload.single('post-thumbnail'),postValidator,editPostPostController)

router.get('/delete/:postId',isAuthenticated,DeletePostGetController)

router.get('/',isAuthenticated,alPostGetController)

module .exports=router