const mongoose = require('mongoose')
const { countDBConnect } = require('../helpers/db.check.connect')
const { db: { host, port, name } } = require('../configs/config.js')

const connectString = `mongodb://${host}:${port}/${name}` 

// this kind of connection is between SERVER --- DB
// not the kind of connections in connection pool 
// whenever there's a command request for data
class Database {
    constructor() { 
        // when the first instance is created
        // put all the initial instructions here
        this.connect();
    }

    connect(type = 'mongodb') {
        
        console.log('connect string: ', connectString)

        // for development
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true})
        }

        mongoose.connect(connectString, {
            maxpoolSize: 50
        }).then(() => { console.log('Connect mongodb successs: ', connectString); countDBConnect() })
        .catch( err => console.log('error connect'))

    }

    // normally in javascript we don't need to declare "instance" variable since... 
    // ...if the variable is called using "CLASS.variable" such as (Database.instance),
    // the variable (instance) will automatically type to "static" 
    // but it's best practice in terms of syntax and logic in other languages    
    static instance; 

    // this function can also be used by the entire program
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance(); // get instance from class Database

module.exports = instanceMongodb



