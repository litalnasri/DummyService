'use strict';

module.exports = (body, secret, cb) => {
	if (!body) {
		return cb(new Error('invalid jwtdata'));
	}

	require('jsonwebtoken').verify(body, secret, {
		algorithm: 'HS256'
    }, cb);

  
    
};