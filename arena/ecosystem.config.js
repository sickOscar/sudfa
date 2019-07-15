let deploy = {};
try {
  deploy = require('./ecosystem.deploy');
} catch (err) {
  console.log('No deploy loaded');
}

module.exports = {
  apps : [{
    name: 'API',
    script: 'index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    // args: 'one two',
    instances: 1,
    autorestart: true,
    watch: ['index.js', 'src'],
    "ignore_watch" : ["node_modules"],
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'development',
      PORT: 5001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5001
    }
  }],

  deploy
};
