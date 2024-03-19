import _ from 'lodash';

class AppError extends Error {
    constructor(message, statusCode) {
        super(_.get(message, message)?.message || message);

        const errObj = _.get(message, message) || { };

        this.statusCode = errObj.status || statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;