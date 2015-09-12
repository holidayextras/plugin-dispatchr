# plugin-dispatchr

[![Build Status](https://api.shippable.com/projects/55f495c61895ca447414ddec/badge?branchName=master)](https://app.shippable.com/projects/55f495c61895ca447414ddec/builds/latest)

## About

A [hapi](http://hapijs.com/) plugin that wraps around a call to Dispatchr service


### Registering with the server

This plugin conforms to the [hapijs plugin interface](http://hapijs.com/api#plugin-interface).

While bootstrapping your Hapi server, include the plugin like so:

```
server.pack.register( [
	require( 'plugin-dispatchr' )
], function() {
	server.start( function() {
		console.log( 'server started with plugin-dispatchr plugin initialised' );
	} );
} );
```

#### Function: makeItSo

To be written....

## Contributing

Code is linted checked against the style guide with [make-up](https://github.com/holidayextras/make-up), running npm test will run all tests required.

## License
Copyright (c) 2015 Holiday Extras Ltd
Licensed under the MIT license.