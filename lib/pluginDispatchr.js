'use strict';

function buildReject( error, context ) {
  return {
    error: error,
    origin: 'pluginDispatchr',
    data: context
  };
}

exports.register = function( server, registerOptions, next ) {


  function makeItSo( options ) {
    buildReject( 'some error', options );

  }

  server.expose( 'makeItSo', makeItSo );
  next();
};

exports.register.attributes = {
  pkg: require( '../package.json' )
};
