const router = require('express').Router()

const {searchReasultGetController} = require('../controllers/searchController')
 
router.get('/',searchReasultGetController)

module.exports = router