const crypto = require('crypto')

const genRandomStringAsync = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err)
            else resolve(buf.toString('hex'))
        })
    })    
}

module.exports = {
    genRandomStringAsync
}