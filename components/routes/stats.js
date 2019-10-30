'use strict';

const fs = require('fs');
const friendly = process.env.FRIENDLY;

module.exports = function (webserver, controller) {
    webserver.get('/user-stats', (req, res) => {
        if (req.query) {
            if (friendly === req.query.key) {
                let statsData = JSON.parse(fs.readFileSync('.data/db/stats/active.json', 'utf8'));
                res.json(statsData);
            }
        } else {
            res.status(403);
        }
    });
};