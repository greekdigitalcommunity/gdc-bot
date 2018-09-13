'use strict';

const fs = require('fs');
const request = require('request');
const { JSDOM } = require('jsdom');

const STOPWORDS = /(?:^|\s+)(?:(job opening -))(?=\s+|$)/gi;

const validateUrl = (value) => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);

const syncToLocalFile = (data) =>
  fs.writeFile('.data/db/jobs/jobs.json', JSON.stringify(data), (err) => {
    if (err) {
      console.log('could not backup listings to file');
    }
  });

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
