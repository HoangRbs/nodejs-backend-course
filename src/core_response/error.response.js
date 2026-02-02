const { StatusCodes, ReasonPhrases } = require('./httpStatusCode');


// const StatusCodes = {
//     FORBIDDEN: 403,
//     CONFLICT: 409,
//     NOTFOUND: 404
// }

// const ReasonPhrases = {
//     FORBIDDEN: 'Bad request error',
//     CONFLICT: 'Conflict error',
//     NOTFOUND: 'Not found'
// }

class BaseError extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class ConflictRequestError extends BaseError {
    constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
        super(message, status);
    }
}

class BadRequestError extends BaseError {
    constructor(message = ReasonPhrases.BAD_REQUEST, status = StatusCodes.BAD_REQUEST) {
        super(message, status);
    }
}

class NotFoundRequestError extends BaseError {
    constructor(message = ReasonPhrases.NOTFOUND, status = StatusCodes.NOTFOUND) {
        super(message, status);
    }
}

class AuthFailureError extends BaseError {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
        super(message, status);
    }
}

class ForbiddenError extends BaseError {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
        super(message, status);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    NotFoundRequestError,
    AuthFailureError,
    ForbiddenError,
}

