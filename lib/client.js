var events = require('events'),
    util   = require('util'),
    redis  = require('redis');

// Redis Sentinel Client Class
var SentinelClient = function(port, host, options){
    events.EventEmitter.call(this);

    options = options || {};
    options.no_ready_check = true;

    this.redis = redis.createClient(port, host, options);
    this.redis.on('pmessage', this.messageHandler());
    this.redis.psubscribe('*');
};

util.inherits(SentinelClient, events.EventEmitter);

// Message Handler
SentinelClient.prototype.messageHandler = function(){
    var sc = this;

    return function(pattern, channel, details) {
        console.log(channel);
        console.log(details);
        
        // Prase details message
        details = details.split(' ');

        // Emit sentinel events
        switch(channel) {
            case '+odown':
                var server = {
                    host: details[2],
                    port: details[3]
                };
                sc.emit('down', server);
                break;
            case '+switch-master':
                var server = {
                    host: details[3],
                    port: details[4]
                };
                sc.emit('failover', server);
                break;
        }
    };
};

module.exports = SentinelClient;
