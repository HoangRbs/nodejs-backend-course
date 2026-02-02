const { Create, Ok } = require('../core_response/success.response');
const AccessService = require('../services/access.service')

class AccessController {

    signUp = async(req, res, next) => {
        // testinghehehehehe // testing catch async

        // the service do many complicated process 
        const result = await AccessService.signUp(req.body);

        // return res.status(201).json(result)
        new Create(res, 'registered', result)
    }

    logIn = async(req, res, next) => {
        new Ok(
            res, 
            'logged In', 
            await AccessService.logIn(req.body)
        )
    }

    logOut = async(req, res, next) => {
        new Ok(
            res, 
            'logged out success', 
            await AccessService.logOut(req.keyStore)
        )
    }

    handleRefreshToken = async(req, res, next) => {
        new Ok(
            res, 
            'get access token success',
            await AccessService.handleRefreshToken(req.body)
        )
    }

    createApiKey = async(req, res, next) => {
        new Ok(
            res, 
            'get api key success',
            await AccessService.createApiKey()
        )
    }
}

module.exports = new AccessController()