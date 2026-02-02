const dev = {
    app: {
        port: process.env.PORT || 3056
    },
    db: {
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT || 27017,
        name: process.env.MONGO_DB_NAME || 'ecom_dev'
    }
}

const pro = {
    app: {
        port: process.env.PORT || 3056
    },
    db: {
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT || 27017,
        name: process.env.MONGO_DB_NAME || 'ecom_dev'
    }
}

const config = { 
    dev,
    pro
}
const env = process.env.NODE_ENV || 'dev'

console.log(env, config[env]);

module.exports = config[env]