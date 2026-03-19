const { BadRequestError, AuthFailureError, NotFoundRequestError } = require("../core_response/error.response");
const catchAsync = require("../helpers/catchAsync");
const { verifyJwtAsync } = require("../helpers/JwtAsync");
const ApiKeyService = require("../services/apiKey.service");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    X_CLIENT_ID: 'x-client-id',
}

const checkApiKey = async (req, res, next) => {
    
    const api_key = req.headers[HEADER.API_KEY]?.toString()

    if (!api_key) {
        console.log('no api key')
        return next(new BadRequestError())
    }

    // check keyObj
    const keyObj = await ApiKeyService.findKey(api_key)
    if (!keyObj) {
        console.log('no keyObj found')
        return next(new BadRequestError())
    }

    // pass data inside "req obj, so the next midware can use it (permission)
    req.keyObj = keyObj

    return next()
}

const checkApiKeyPermission = (permission) => {
    return (req, res, next) => {

        // To use this function, we must have "checkApiKey" ran PREVIOUSLY fist
        // So we check for the keyObj is in the "req" or not as a constraint
        // because we might ACCIDENTLY didn't use "checkApiKey" middle ware PREVIOUSLY (for some reason)
        if (!req.keyObj) {  
            console.log('no keyObj in req')
            return next(new BadRequestError())
        }

        const validPermission = req.keyObj.permissions.includes(permission)

        if (!validPermission) {
            console.log('permission not valid') 
            return next(new BadRequestError())
        }

        return next()
    }
}

// Authorization
const checkAccessToken = catchAsync(
    async (req, res, next) => {    
        // get userId 
        // although we could get userId right in the access token payload
        // but this add a tiny layer of security I guest
        const userId = req.headers[HEADER.X_CLIENT_ID]
        if(!userId) throw new AuthFailureError('Invalid Request')

        // check key stored of current user in db and get accessTokenSecretKey
        const keyStore = await KeyTokenService.findByUserId(userId);
        if(!keyStore) throw new NotFoundRequestError('Invalid Request')

        // get access token
        const accessToken = req.headers[HEADER.AUTHORIZATION]
        if(!accessToken) throw new AuthFailureError('Invalid Request')
        
        try {
            const decodedUser = await verifyJwtAsync(accessToken, keyStore.accessTokenSecretKey) 

            if(decodedUser.userId !== userId) throw new AuthFailureError('Invalid User id')
            
            req.keyStore = keyStore // the next middlewares can use this keyStore
            // save current user's keyStore in "current" req obj
            // means many requests have different "req objects"

            req.user = decodedUser // the next middlewares can use this decodedUser, 
            // AND MUST USE this decoded User ID for SECURITY purpose (look into product controller, service, postman folder)
    
            return next()
        
        } catch (err) {
            console.log(' \n ------error in check access token midware:------ \n\n', err, '\n')

            // jwt verify error
            if(!err.status)
                throw new AuthFailureError('invalid access token')

            // else other normal errors
            throw err
        }
    }
)

module.exports = {
    checkApiKey,
    checkApiKeyPermission,
    checkAccessToken
}