const shopModel = require('../models/shop.model.js')
const bcrypt = require('bcrypt')
const { createTokenPair, createAccessToken } = require('../auth/authUtils.js')
const KeyTokenService = require('./keyToken.service.js')
const { BadRequestError, AuthFailureError, ForbiddenError } = require('../core_response/error.response.js')
const ShopService = require('./shop.service.js')
const { verifyJwtAsync } = require('../helpers/JwtAsync.js')
const { genRandomStringAsync } = require('../helpers/genRandomStringAsync.js')
const ApiKeyService = require('./apiKey.service.js')

const RoleType = {
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

// no longer use this asymetric encryption (only for complicated enough application)
const getKeyPairAsync = () => {
    return new Promise((resolve, reject) => {
        crypto.generateKeyPair(
            'rsa', // asymmetric cryption
            {
                modulusLength: 4096
            }, 
            (err, publicKey, privateKey) => {
                if(err) reject(err);
                else resolve({ privateKey, publicKey })
            }
        )
    })
}

class AccessService {

    static signUp = async({name, email, password}) => {
        
        
        //1. check email exists ??
        const shop = await shopModel.findOne({email}) // the same as {email: email}
        if(shop) {
            throw new BadRequestError('Error: email already used')
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const roles = [RoleType.ADMIN] 

        const newShop = await shopModel.create({
            name, 
            email, 
            password: passwordHash, 
            roles 
        })

        // if new record is successfully created
        if (newShop) {
            // goal: create access token and refresh token to send back to the user.
            
            // the keys to generate tokens
            const access_token_secretKey = await genRandomStringAsync()
            const refresh_token_secretKey = await genRandomStringAsync()

            // create access token and refresh token
            const tokenPair = await createTokenPair(
                {
                    userId: newShop._id
                }, 
                access_token_secretKey, 
                refresh_token_secretKey
            ); 

            // save secret keys to database
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                accessTokenSecretKey: access_token_secretKey,
                refreshTokenSecretKey: refresh_token_secretKey,
                refreshToken: tokenPair.refreshToken
            })

            if(!keyStore) {
                throw new BadRequestError('Error: Key store error')
            }

            // send tokenPair back to the client
            return {
                shop: {
                    _id: newShop._id,
                    name: newShop.name,
                    email: newShop.email
                },
                tokenPair
            }
        }
        
    }

    static logIn = async ({email, password}) => {
        // 1.
        const foundShop = await ShopService.findByEmail(email)
        if (!foundShop) throw new BadRequestError('Shop not registered')

        // 2.
        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication error')

        // 3. keys to generate tokens
        const access_token_secretKey = await genRandomStringAsync()
        const refresh_token_secretKey = await genRandomStringAsync()

        // 4. create access token and refresh token
        const tokenPair = await createTokenPair(
            {
                userId: foundShop._id
            }, 
            access_token_secretKey, 
            refresh_token_secretKey
        ); 

        // 5. update secret keys, refresh token to database
        const keyStore = await KeyTokenService.updateKeyToken({
            userId: foundShop._id,
            accessTokenSecretKey: access_token_secretKey,
            refreshTokenSecretKey: refresh_token_secretKey,
            refreshToken: tokenPair.refreshToken
        })

        if(!keyStore) {
            throw new BadRequestError('Error: Key store error')
        }
        
        return {
            // shop: getInfoData({
            //     fields: ['_id', 'name', 'email'], (lodash -- later)
            //     object: foundShop
            // }),
            shop: {
                _id: foundShop._id,
                name: foundShop.name,
                email: foundShop.email
            },
            tokenPair
        }
    }

    static createApiKey = async() => {
        return await ApiKeyService.createApiKey()
    }

    static logOut = async(keyStore) => {
        // remvove secretkey token, refresh token data, means the keyStore of that user 
        await KeyTokenService.removeById(keyStore._id)
    }

    static handleRefreshToken = async({ refreshToken }) => {

        // normally, we'll have a system like an AI 
        // that detect anomally behaviors in other function 
        // and it adds those refresh tokens to the used refresh token array
        // then later we'll check for those used refresh token in this function 


        // check if an attacker send an used refresh token
        const foundUsedToken_keystore = await KeyTokenService.findByRefreshTokensUsed(refreshToken)
        if(foundUsedToken_keystore) {
            // oh, an attacker !
            // who is the guy, might add "email" inside the payload for more information
            const { userId } = await verifyJwtAsync(refreshToken, foundUsedToken_keystore.refreshTokenSecretKey)
            
            console.log('---------- anomally behavior! ------------') 
            console.log('user that sent the refreshToken: ', userId)
            console.log('the founded refreshToken is in the user', foundUsedToken_keystore.user)

            // ... system do smt with the attacker, ... more features

            // protect our main user
            await KeyTokenService.deleteByUserId(foundUsedToken_keystore.user)
            throw new ForbiddenError('Something went wrong, pls relogin')
        }

        // if the refreshToken still exist in database, means that user still loggin In
        const foundToken_keyStore = await KeyTokenService.findByRefreshToken(refreshToken)
        
        // some attacker can send the stolen refresh token after the user log out (refresh token was deleted)
        if(!foundToken_keyStore) throw new AuthFailureError('pls log in first')

        // even if the refresh token in database is found, 
        // but the db its self can also be attacked and modified,
        // so one more security is that we need to verify with the private key
        const { userId } = await verifyJwtAsync(refreshToken, foundToken_keyStore.refreshTokenSecretKey)
        
        // valid refresh token

        // send user new access token, usually with restful design, we must get userId from the req
        const newAccessToken = await createAccessToken(
            {
                userId: userId
            }, 
            foundToken_keyStore.accessTokenSecretKey
        );

        return {
            accessToken: newAccessToken
        }
    }
}

module.exports = AccessService