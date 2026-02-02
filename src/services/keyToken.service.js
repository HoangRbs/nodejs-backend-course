const keyTokenModel = require('../models/keyToken.model')

class KeyTokenService {
    // store new access, refresh token secret key to database 
    static createKeyToken = async ({ userId, accessTokenSecretKey, refreshTokenSecretKey, refreshToken }) => {
        
        const keyStore = await keyTokenModel.create({
            user: userId,
            accessTokenSecretKey,
            refreshTokenSecretKey,
            refreshToken
        })
        
        return keyStore ? keyStore.user : null
    }

    static updateKeyToken = async ({ userId, accessTokenSecretKey, refreshTokenSecretKey, refreshToken }) => {
        
        // find key token belongs to the user id
        const filter = { user: userId }

        const update = {
            accessTokenSecretKey,
            refreshTokenSecretKey,
            refreshToken 
        }

        const keyUpdate = await keyTokenModel.findOneAndUpdate(filter, update)

        // user's key token does not exist (after user logs out)
        if (!keyUpdate) {
            const keyStore = await keyTokenModel.create({
                user: userId,
                accessTokenSecretKey,
                refreshTokenSecretKey,
                refreshToken
            })
            
            return keyStore ? keyStore.user : null
        }    

        return keyUpdate.user;
    }


    static removeById = async(keyStoreId) => {
        return await keyTokenModel.findByIdAndDelete(keyStoreId)
    }

    static findByUserId = async(userId) => {
        return await keyTokenModel.findOne({ user: userId }).lean()
    }

    static deleteByUserId = async(userId) => {
        return await keyTokenModel.findByIdAndDelete({ user: userId })
    }

    static findByRefreshToken = async(refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken: refreshToken }) 
    }

    static findByRefreshTokensUsed = async(refreshToken) => {
        // if that one document with refreshTokensUsed [..,..,..] contains refreshToken
        return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken }) 
    }
}

module.exports = KeyTokenService