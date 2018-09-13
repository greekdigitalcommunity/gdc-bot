'use strict';

const fs = require('fs');

module.exports = function (controller) {

  controller.on('slash_command', (bot, message) => {
    if (message.command !== '/jobs') {
      return;
    }
    console.log(`${message.command} command triggered`);

    let jobData = JSON.parse(fs.readFileSync('.data/db/jobs/jobs.json', 'utf8'));
    let output;

    jobData.jobs.forEach(job => {
      output += `${job.url}, posted by ${job.postedBy}, on ${job.postedOn}\n`;
    });

    bot.replyPrivate(message,
      {
        text: output,
        link_names: 1,
        parse: 'full'
      });
  });
};
