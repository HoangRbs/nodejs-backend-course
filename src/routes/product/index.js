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

router.get('/drafts/all', catchAsync(productController.getDraftsForShop))
router.get('/published/all', catchAsync(productController.getPublishedForShop))

router.put('/publish/:id', catchAsync(productController.publishProductByShop))
router.put('/unPublish/:id', catchAsync(productController.unPublishProductByShop))

module.exports = router