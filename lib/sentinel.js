var SentinelClient = require('./client');

module.exports.createClient = function(port, host, options) {
    return new SentinelClient(port, host, options);
};
