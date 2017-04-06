'use strict'
var dispatchr = require('dispatchr-module')
var _ = require('lodash')
var Q = require('q')
var defaultOptions = require('./defaultOptions')

function buildReject (error, context) {
  return {
    error: error,
    origin: 'pluginDispatchr',
    data: context
  }
}

exports.register = function (server, registerOptions, next) {
  function _getValidationErrors (options, validator) {
    var validatorErrors = []

    // loop over each key in the validator and ensure its in the data object and the value matches the validator function
    _.forEach(validator, function (validatorFunction, key) {
      if (_.isUndefined(options[key]) || !validatorFunction(options[key])) {
        validatorErrors.push('options.' + key)
      }
    })

    return validatorErrors
  }

  function publishEmail (options) {
    var validator = {
      type: _.isString,
      subject: _.isString,
      to: _.isObject,
      from: _.isObject,
      body: _.isObject
    }

    // If there are any errors then pump them all out together as one String.
    var validatorErrors = _getValidationErrors(options, validator)
    if (validatorErrors.length) {
      return Q.reject(buildReject(new TypeError('invalid ' + validatorErrors.join(' ')), options))
    }

    // Clone the default options and then overwrite them with any passed in options for this request.
    options = _.assign(_.clone(defaultOptions), options)

    var deferred = Q.defer()

    dispatchr.publish('email', options, function (error) {
      if (error) {
        deferred.reject(buildReject(error))
      }
      deferred.resolve()
    })

    return deferred.promise
  }
  server.expose('publishEmail', publishEmail)
  next()
}

exports.register.attributes = {
  pkg: require('../package.json')
}
