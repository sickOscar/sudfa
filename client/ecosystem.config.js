let deploy = {};
try {
    deploy = require('./ecosystem.deploy');
} catch (err) {
    console.log('No deploy loaded');
}

module.exports = {
    apps : [],

    deploy
};
