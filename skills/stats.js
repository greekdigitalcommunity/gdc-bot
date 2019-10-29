'use strict';

const fsSync = require('../scripts/fsSync');
const moment = require('moment');

const AT_START_OF_DAY = moment().startOf('day').toString();
const AT_END_OF_DAY = moment().endOf('day').toString();
const STATS_ACTIVE = '.data/db/stats/active.json';

const stats = {
  slashCommands: 0,
  triggers: 0,
  convos: 0,
  newUsers: []
};

const presentStats = (bot, message) => {
  bot.api.users.list({ presence: true }, (err, response) => {
    let users = 0;
    let active = 0;
    response.members.forEach(user => {
      if (!user.is_bot && !user.is_app_user && !user.deleted) {
        if (user.presence === 'active') {
          active++;
        }
        users++;
      }
    });
    fsSync.syncToLocalFile([{ 'registered': users, 'active': active }], STATS_ACTIVE);
    bot.replyPrivate(message,
      {
        text:
          `*${users}* registered - *${active}* active\n`
          + `*${stats.slashCommands}* slashCommandActions\n`
          + `*${stats.triggers}* triggerActions\n`
          + `*${stats.convos}* conversationStartedActions\n`,
        link_names: 1, parse: 'full'
      }
    );
  });
};

module.exports = function (controller) {

  controller.on('heard_trigger', function () {
    stats.triggers++;
  });

  controller.on('conversationStarted', function () {
    stats.convos++;
  });

  controller.on('team_join', function (bot, message) {
    const now = moment().toString();
    console.log('NEW USER JOINED AT', now, bot, message);
    stats.newUsers.push({ newUser: now });
  });

  controller.on('slash_command', function (bot, message) {
    if (message.command !== '/stats') {
      return;
    }
    stats.slashCommands++;

    bot.api.users.info({ user: message.user_id }, (err, response) => {
      if (response.user.is_admin) {
        presentStats(bot, message);
      }
    });
  });
};
