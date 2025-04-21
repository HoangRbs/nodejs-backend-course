const jwt = require('jsonwebtoken')

const verifyJwtAsync = (token, tokenSecretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, tokenSecretKey, (err, decoded) => {
            if (err) reject(err)
            else resolve(decoded)
        })
    })    
}

const signJwtAsync = (payload, tokenSecretKey, options) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, tokenSecretKey, options, 
            (err, encodedToken) => {
                if (err) reject(err)
                else resolve(encodedToken)
            }
        )
    })    
}


module.exports = {
    verifyJwtAsync,
    signJwtAsync
}