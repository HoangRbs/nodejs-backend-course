const { StatusCodes, ReasonPhrases } = require('./httpStatusCode');

// StatusCode = {
//     OK: 200,
//     CREATED: 201
// }

// ReasonPhrases = {
//     OK: 'Success',
//     CREATED: 'Created'
// }

class BaseSuccessResponse {

    constructor(res, message, status = StatusCodes.OK, data = {}) {
        this.message = message;
        this.status = status;
        this.data = data;

        this.send(res)
    }

    send(res) {
        return res.status(this.status).json(this)
    }
}

class Ok extends BaseSuccessResponse {
    constructor(
        res, 
        message = ReasonPhrases.OK,  
        data = {}) 
    {
        super(res, message, StatusCodes.OK, data)
    }
}


class Create extends BaseSuccessResponse {
    constructor(
        res, 
        message = ReasonPhrases.CREATED,  
        data = {}) 
    {
        super(res, message, StatusCodes.CREATED, data)
    }
}

module.exports = {
    Ok,
    Create
}