# plugin-dispatchr

[![Circle CI](https://circleci.com/gh/holidayextras/plugin-dispatchr/tree/master.svg?style=svg&circle-token=4846db9d7b85bf5117c58f793183d639f8cc802b)](https://circleci.com/gh/holidayextras/plugin-dispatchr)

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

#### Function: publishEmail

This sends a request down to the dispatchr-module's publish function, which publishes a request to the Dispatchr email queue. 

The Dispatchr service runs as a separate service and will pick up the request when ready to send an email.

Example usage:

```
var options = {
	type: 'confirmation',
	subject: 'Booking Confirmation - MR TEST - 5ABCDEF',
	to: {
		name: 'Customer Name',
		email: 'customer@name.com'
	},
	from: {
		name: 'Paultons Breaks',
		email: 'do_not_reply@holidayextras.com'
	},
	body: {
		html: {
			location: 'https://example.com/confirmation.html'
		},
		text: {
			location: 'https://example.com/confirmation.txt'
		}
	},
	bcc: [
		{
			name: 'HX Vouchers',
			email: 'vouchers2@holidayextras.com'
		}
	]
};
return request.server.plugins['plugin-dispatchr'].publishEmail( options );

```

## Contributing

Code is linted checked against the style guide with [make-up](https://github.com/holidayextras/make-up), running npm test will run all tests required.

## License
Copyright (c) 2015 Holiday Extras Ltd
Licensed under the MIT license.