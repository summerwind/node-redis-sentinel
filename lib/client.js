var events = require('events'),
    util   = require('util'),
    redis  = require('redis');

var SentinelClient = function(port, host, options){
    events.EventEmitter.call(this);

    options = options || {};
    options.no_ready_check = true;

    this.redis = redis.createClient(port, host, options);
    this.redis.on('pmessage', this.messageHandler());
    this.redis.psubscribe('*');
};

util.inherits(SentinelClient, events.EventEmitter);

SentinelClient.prototype.messageHandler = function(){
    var sc = this;

    return function(pattern, channel, message) {
        console.log(pattern);
        console.log(channel);
        console.log(message);
    };
};

module.exports = SentinelClient;
