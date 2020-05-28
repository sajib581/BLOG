const router = require('express').Router() 
const {
    exploreGetController,
    singlePostGetController
} = require('../controllers/exploreController')

router.get('/:postId',singlePostGetController)

router.get('/',exploreGetController)

module.exports = router 