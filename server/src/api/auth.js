
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://sudfa.eu.auth0.com/.well-known/jwks.json'
  }),
//   audience: 'jsfight',
  audience: 'ksXuneu15cJyv6ScLs4m8TBOGH2qFiMD',
  issuer: 'https://sudfa.eu.auth0.com/',
  algorithms: ['RS256']
});


module.exports =  {
  jwtCheck
};
