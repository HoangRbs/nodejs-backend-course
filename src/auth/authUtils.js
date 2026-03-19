const { signJwtAsync } = require("../helpers/JwtAsync")


const createTokenPair = async(payload, accessTokenSecret, refreshTokenSecret) => {
    
    const accessToken = await signJwtAsync(payload, accessTokenSecret, {
        expiresIn: '60m' // temporary, since I have to test many case
    })

    const refreshToken = await signJwtAsync(payload, refreshTokenSecret, {
        expiresIn: '3d' // temporary, since I have to test many case
    })

    return { accessToken, refreshToken }
    
}

const createAccessToken = async(payload, accessTokenSecret) => {
    const accessToken = await signJwtAsync(payload, accessTokenSecret, {
        expiresIn: '10m' // temporary, since I have to test many case
    })

    return accessToken
}

module.exports = {
    createTokenPair,
    createAccessToken
}