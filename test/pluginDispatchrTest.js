/*eslint no-unused-expressions:0 */
'use strict';

var chai = require( 'chai' );
var chaiAsPromised = require( 'chai-as-promised' );
chai.use( chaiAsPromised );
chai.should();
var sinon = require( 'sinon' );
var _ = require( 'lodash' );

var dispatchr = require( 'dispatchr-module' );
var Hapi = require( 'hapi' );

var server;

// allow resources to be required safely
function loadTestResource( resource ) {
  return _.cloneDeep( require( './' + resource ) );
}

describe( 'pluginDispatchr', function() {

  before( function( done ) {
    // Need to start up a server
    server = new Hapi.Server();

    // and then register this plugin to that server
    server.pack.register( require( '../lib/pluginDispatchr' ), function() {
      done();
    } );
  } );

  describe( '#register', function() {
    it( 'should allow us to access the plugin off the hapi server', function( done ) {
      server.plugins[ 'plugin-dispatchr' ].should.not.equal( undefined );
      done();
    } );
  } );

  describe( '#publishEmail', function() {

    context( 'Validation', function() {

      it( 'should fail when the options are missing required parameters', function() {
        return server.plugins[ 'plugin-dispatchr' ].publishEmail( {} ).should.eventually.be.rejected.and.eventually.have.property( 'error' ).that.is.an.instanceof( TypeError );
      } );

    } );

    context( 'Dispatchr module successful', function() {
      var checkType;
      var checkOptions;

      before( function( done ) {
        sinon.stub( dispatchr, 'publish', function( type, options, callback ) {
          checkType = type;
          checkOptions = options;
          callback();
        } );
        done();
      } );

      it( 'should be call dispatchr-module with the correct parameters and resolve', function() {
        return server.plugins[ 'plugin-dispatchr' ].publishEmail( loadTestResource( 'fixtures/validOptions' ) ).then( function() {
          checkType.should.equal( 'email' );
          checkOptions.should.deep.equal( loadTestResource( 'expected/validMergedOptions' ) );
        } );
      } );

      after( function( done ) {
        dispatchr.publish.restore();
        done();
      } );

    } );

    context( 'Dispatchr module errorred', function() {

      before( function( done ) {
        sinon.stub( dispatchr, 'publish', function( type, options, callback ) {
          callback( 'error ');
        } );
        done();
      } );

      it( 'should pass back errors from dispatchr-module as a rejected promise', function() {
        return server.plugins[ 'plugin-dispatchr' ].publishEmail( loadTestResource( 'fixtures/validOptions' ) ).should.be.rejected;
      } );

      after( function( done ) {
        dispatchr.publish.restore();
        done();
      } );

    } );


  } );

} );
