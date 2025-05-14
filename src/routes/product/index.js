const express = require('express')
const router = express.Router()
const productController = require('../../controllers/product.controller')
const catchAsync = require('../../helpers/catchAsync')
const { checkAccessToken, checkApiKey, checkApiKeyPermission } = require('../../auth/checkAuth')

// testing -----------------------
// product folder:
// goal: test midware in access folder, it should not go through that midware
// if yes :((( it also has go through the "check access token" 
// and "check api key" inside "access" folder as well :(, not what we wanted.
const { Ok } = require('../../core_response/success.response')
router.get('/testmidware', async (req, res, next) => {
    new Ok(
        res, 
        'product test midware',
        { testing: 'product test midware' }
    )
}) 
// ------------------------------

// check api key
router.use(checkApiKey)

// check permission of api_key 
router.use(checkApiKeyPermission('0000'))

// authorization
router.use(checkAccessToken)

router.post('/createProduct', catchAsync(productController.createProduct))

router.get('/drafts/all', catchAsync(productController.getDraftsForShop))
router.get('/published/all', catchAsync(productController.getPublishedForShop))

router.put('/publish/:id', catchAsync(productController.publishProductByShop))
router.put('/unPublish/:id', catchAsync(productController.unPublishProductByShop))

module.exports = router