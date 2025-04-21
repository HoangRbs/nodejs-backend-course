const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product.controller')
const catchAsync = require('../../helpers/catchAsync')
const { checkAccessToken, checkApiKey, checkApiKeyPermission } = require('../../auth/checkAuth')

// authorization
router.use(checkAccessToken)

// check api key (middle ware) 
router.use(checkApiKey)

// check permission of api_key midware
router.use(checkApiKeyPermission('0000'))

router.post('/createProduct', catchAsync(productController.createProduct))


module.exports = router