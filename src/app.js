require('dotenv').config()
const express  = require('express')
const app  = express()
const morgan = require('morgan')
const helmet = require ('helmet')
const compression = require('compression')
const { NotFoundRequestError } = require('./core_response/error.response.js')

// console.log('process.env:: ', process.env);

// init middlewares
app.use(morgan('dev'))
// app.use(morgan('combined'))
// app.use(morgan('common'))
// app.use(morgan('short'))
// app.use(morgan('tiny'))

app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init db
require('./dbs/init.mongodb.js')
// const { checkDBOverload } = require('./helpers/db.check.connect')
// checkDBOverload();

// init routes
// auto get the routes/index.js file
app.use('', require('./routes'))


// request for non-exist route  
app.use((req, res, next) => {
    // test internal server error
    // try {
    //     a
    // } catch(err) {
    //     return next(err)
    // }

    // if you call a non existed route, 
    // it automatically go down to this midware
    
    next(new NotFoundRequestError())
})

// handling errors

app.use((err, req, res, next) => {
    // 500: internal server error: 
    // such as program crash because of logic, synctax, ....
    // that is "thrown" by the program
    // but in order for that kind of error to get into this error handler
    // it has to be catched and next(err)

    // check since our custom errors have status
    if(err.status) {
        const statusCode = err.status
        return res.status(statusCode).json({
            state: 'error',
            code: statusCode,
            message: err.message
        })
    } 
    
    // internal server error should not be shown to user (hack)
    console.log(err)

    return res.status(500).json({
        state: 'error',
        code: 500,
        message: 'Internal Server Error'
    })
})


module.exports = app

