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
        // Emit sentinel message events
        sc.emit(channel, details);
        
        console.log(channel);
        console.log(details);
        
        // Prase details message
        details = details.split(' ');

        // Emit module events
        switch(channel) {
            case '+odown':
                sc.down(details);
                break;
            case '+switch-master':
                sc.failover(details);
                break;
        }
    };
};

// Down
SentinelClient.prototype.down = function(details){
    var server = {
        host: details[2],
        port: details[3]
    };
        
    this.emit('down', server);
};

// Failover
SentinelClient.prototype.failover = function(details){
    var server = {
        host: details[3],
        port: details[4]
    };

    var client = redis.createClient(server.port, server.host);
    
    this.emit('failover', server, client);
};

module.exports = SentinelClient;

