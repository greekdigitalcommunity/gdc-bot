var debug = require('debug')('botkit:user_stats');

const schedule = require('node-schedule');
const fs = require('fs');

const NOOB_FS = process.env.NOOB_FS || '';

module.exports = function (controller) {

  let cronTask = schedule.scheduleJob('0 * * * *', function () {
    try {
      let parsedJson = JSON.parse(NOOB_FS);
      let readyBot = {
        token: parsedJson.bot.token,
        user_id: parsedJson.bot.user_id,
        createdBy: parsedJson.bot.createdBy,
        app_token: parsedJson.bot.access_token,
      };

      let bot = controller.spawn(readyBot);

      controller.trigger('collectUserStats', [bot]);
    } catch (e) {
      console.log('Could not get readyBot for scheduled task.', e);
    }
  });
};
