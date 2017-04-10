class Logger {
  name () {
    return this
  }
}
Logger._logInfo = function _logInfo (data, message) {
  if (message) {
    console.log(message)
  }
}

Object.assign(Logger.prototype, {
  trace: Logger._logInfo,
  debug: Logger._logInfo,
  info: Logger._logInfo,
  warn: console.warn,
  error: console.error,
  fatal: console.error
})

module.exports = Logger
