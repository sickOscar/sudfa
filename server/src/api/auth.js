
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://codeinthedarkve.eu.auth0.com/.well-known/jwks.json'
  }),
//   audience: 'jsfight',
  audience: 'XIa57QS7CiWhoD5Oo0xR8H78MGdJ45jL',
  issuer: 'https://codeinthedarkve.eu.auth0.com/',
  algorithms: ['RS256']
});


module.exports =  {
  jwtCheck
};
