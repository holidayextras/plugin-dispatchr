'use strict'

var expect = require('chai')
  .use(require('chai-as-promised'))
  .use(require('dirty-chai'))
  .expect
var sinon = require('sinon')
var sandbox = sinon.sandbox.create()
var _ = require('lodash')

var Logger = require('../lib/logger')
var dispatchr = require('dispatchr-module').configure({
  logger: new Logger()
})
var Hapi = require('hapi')

var server

// allow resources to be required safely
function loadTestResource (resource) {
  return _.cloneDeep(require('./' + resource))
}

describe('pluginDispatchr', function () {
  afterEach(function () {
    sandbox.restore()
  })

  before(async function () {
    // Need to start up a server
    server = new Hapi.Server()

    // and then register this plugin to that server
    await server.register(require('../lib/pluginDispatchr'))
  })

  describe('#register', function () {
    it('should allow us to access the plugin off the hapi server', function () {
      expect(server.plugins[ 'plugin-dispatchr' ]).to.not.be.undefined()
    })
  })

  describe('#publishEmail', function () {
    context('Validation', function () {
      it('should fail when the options are missing required parameters', function () {
        return expect(server.plugins[ 'plugin-dispatchr' ].publishEmail({})).to.eventually.be.rejected.and.eventually.have.property('error').that.is.an.instanceof(TypeError)
      })
    })

    context('#Dispatchr module successful', function () {
      var checkType
      var checkOptions

      before(function () {
        sandbox.stub(dispatchr, 'publish').callsFake(function (type, options, callback) {
          checkType = type
          checkOptions = options
          callback()
        })
      })

      it('should be call dispatchr-module with the correct parameters and resolve', function () {
        return server.plugins[ 'plugin-dispatchr' ].publishEmail(loadTestResource('fixtures/validOptions')).then(function () {
          expect(checkType).to.equal('email')
          expect(checkOptions).to.deep.equal(loadTestResource('expected/validMergedOptions'))
        })
      })
    })

    context('#Dispatchr module errorred', function () {
      before(function () {
        sandbox.stub(dispatchr, 'publish').callsFake(function (type, options, callback) {
          callback(new Error('error'))
        })
      })

      it('should pass back errors from dispatchr-module as a rejected promise', function () {
        return expect(server.plugins[ 'plugin-dispatchr' ].publishEmail(loadTestResource('fixtures/validOptions'))).to.be.rejected()
      })
    })
  })
})
