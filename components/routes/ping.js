const debug = require('debug')('botkit:incoming_webhooks');

const fs = require('fs');

module.exports = function (webserver, controller) {
    webserver.get('/ping', (req, res) => {
        res.json({ _: 'pong' });
    });
};
