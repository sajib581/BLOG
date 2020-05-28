const router = require('express').Router()
const {isAuthenticated} = require('../../middlewares/authMiddleware')

const {
    commentPostController,
    replyCommentPostController
} = require('../controllers/commentController')

const{
    likesGetController,
    disLikesGetController
} = require('../controllers/likeDislikeController')

const {bookmarksGetController} = require('../controllers/bookmarkController')

router.post('/comments/:postId',isAuthenticated,commentPostController)
router.post('/comments/replies/:commentId',isAuthenticated,replyCommentPostController)

router.get('/likes/:postId',isAuthenticated,likesGetController)
router.get('/dislikes/:postId',isAuthenticated,disLikesGetController)

router.get('/bookmarks/:postId',isAuthenticated,bookmarksGetController)

module.exports = router