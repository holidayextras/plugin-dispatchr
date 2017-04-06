class Logger {
  name () {
    return this
  }
}
Object.assign(Logger.prototype, {
  trace: console.info,
  debug: console.info,
  info: console.info,
  warn: console.warn,
  error: console.error,
  fatal: console.error
})

module.exports = Logger
