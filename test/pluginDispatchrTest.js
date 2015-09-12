/* jslint node: true */
'use strict';

var chai = require( 'chai' );
var chaiAsPromised = require( 'chai-as-promised' );
chai.use( chaiAsPromised );
chai.should();


var Hapi = require( 'hapi' );

var server;

describe( 'pluginDispatchr', function() {

  before( function( done ) {
    // Need to start up a server
    server = new Hapi.Server();
    server.methods.getConfig = function() {
      return {
        cache: {
          host: '127.0.0.1',
          port: '6379'
        }
      };
    };

    // and then register this plugin to that server
    server.pack.register( require( '../lib/pluginDispatchr' ), function() {
      done();
    } );
  } );

  describe( '.register()', function() {
    it( 'should allow us to access the plugin off the hapi server', function( done ) {
      server.plugins[ 'plugin-dispatchr' ].should.not.equal( undefined );
      done();
    } );
  } );

  describe( '.makeItSo()', function() {


  } );

} );
