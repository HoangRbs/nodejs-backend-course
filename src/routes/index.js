const express = require('express')
const { Ok } = require('../core_response/success.response')
const { checkApiKey, checkApiKeyPermission } = require('../auth/checkAuth')
const router = express.Router()

router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))

// for testing
router.get('/', (req, res, next) => {
    new Ok(res, 'welcome')
})

// for testing --------------------
// check api key
router.use(checkApiKey)

// check permission of api_key 
router.use(checkApiKeyPermission('0000'))

router.get('/v1/api/apiKeyFuntionality', (req, res, next) => {
    new Ok(res, 'test apiKey success', {})
})

module.exports = router