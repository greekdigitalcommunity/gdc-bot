const debug = require('debug')('botkit:incoming_webhooks');

const fs = require('fs');
const friendly = process.env.FRIENDLY;

module.exports = function (webserver, controller) {
    webserver.get('/jobs', (req, res) => {
        if (req.query) {
            if (friendly === req.query.key) {
                let jobData = JSON.parse(fs.readFileSync('.data/db/jobs/jobs.json', 'utf8'));
                res.json(jobData);
            }
        } else {
            res.status(403);
        }
    });
};
