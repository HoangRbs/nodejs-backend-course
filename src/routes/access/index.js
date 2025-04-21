const express = require('express')
const router = express.Router()
const accessController = require('../../controllers/access.controller')
const catchAsync = require('../../helpers/catchAsync')
const { checkAccessToken, checkApiKey, checkApiKeyPermission } = require('../../auth/checkAuth')
const { Ok } = require('../../core_response/success.response')

// authentication
router.post('/shop/signUp', catchAsync(accessController.signUp))
router.post('/shop/logIn', catchAsync(accessController.logIn))
router.post('/shop/handleRefreshToken', catchAsync(accessController.handleRefreshToken))

// authorization
router.use(checkAccessToken)

router.post('/shop/createApiKey', catchAsync(accessController.createApiKey))

// to log out, you must be authorized first to do it 
router.post('/shop/logOut', catchAsync(accessController.logOut))


// check api key (middle ware) 
router.use(checkApiKey)

// WAIT !!!! why not using "catchAsync" for "checkApiKey", "checkAccessToken", ... ??
// well we can, but consistantly we only want to use it for "controller"
// and these special functions have kind of different logic
// and needs to be look into the function themselves for deeper modification

// check permission of api_key midware
router.use(checkApiKeyPermission('0000'))

router.get('/apiKeyFuntionality', (req, res, next) => {
    new Ok(res, 'test apiKey success', {})
})

module.exports = router