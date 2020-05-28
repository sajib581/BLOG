const express = require('express')
const router = express.Router()

const signValidetor = require('../validator/auth/signupValidator')
const loginValidetor = require('../validator/auth/loginValidator')
const changePassValidator = require('../validator/auth/changePasswordValidator')

const {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController, 
    logoutController,
    changePasswordGetController,
    changePasswordPostController
} = require('../controllers/authController')

const {isAuthenticated} = require('../middlewares/authMiddleware')

router.get('/signup',signupGetController)
router.post('/signup',signValidetor,signupPostController)

router.get('/login',loginGetController)
router.post('/login',loginValidetor,loginPostController)

router.get('/change-password',isAuthenticated,changePasswordGetController)
router.post('/change-password',isAuthenticated,changePassValidator,changePasswordPostController) 

router.get('/logout',logoutController)

module.exports = router

