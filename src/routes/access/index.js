const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const catchAsync = require('../../helpers/catchAsync')
const { checkAccessToken, checkApiKey, checkApiKeyPermission } = require('../../auth/checkAuth')

// access folder:
// testing this midware from product folder 
router.use(async(req, res, next) => {
    console.log('went through this /v1/api midware in access folder')
    return next()

    // --> that's why we use "/shop" for the below "check access token" midware 
    // so the other routes outside of this don't use the "check access token" midware
})

// authentication
router.post('/shop/signUp', catchAsync(accessController.signUp))
router.post('/shop/logIn', catchAsync(accessController.logIn))
router.post('/shop/handleRefreshToken', catchAsync(accessController.handleRefreshToken))


// authorization
router.use('/shop', checkAccessToken)

router.post('/shop/createApiKey', catchAsync(accessController.createApiKey))

// to log out, you must be authorized first to do it 
router.post('/shop/logOut', catchAsync(accessController.logOut))

// WAIT !!!! why not using "catchAsync" for "checkApiKey", "checkAccessToken", ... ??
// well we can, but consistantly we only want to use it for "controller"
// and these special functions have kind of different logic
// and needs to be look into the function themselves for deeper modification

module.exports = router