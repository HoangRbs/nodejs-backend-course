const express = require('express')
const { Ok } = require('../core_response/success.response')
const router = express.Router()

router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))

// for testing
router.get('/', (req, res, next) => {
    
    // return res.status(200).json({
    //     message: 'welcome',
    // })

    new Ok(res, 'welcome')
})

module.exports = router