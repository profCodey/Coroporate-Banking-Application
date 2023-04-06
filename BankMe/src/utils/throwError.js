const  createError = require('http-errors')

const throwError = (status, message) => {
  throw createError(status, message)
}


module.exports = throwError
