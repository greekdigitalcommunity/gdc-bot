'use strict';

const stats = {
  slashCommands: 0,
  triggers: 0,
  convos: 0
};

const presentStats = (bot, message) => {
  bot.api.users.list({presence: true}, (err, response) => {
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
    bot.replyPrivate(message,
      {text:
      `*${users}* registered - *${active}* active\n`
      + `*${stats.slashCommands}* slashCommandActions\n`
      + `*${stats.triggers}* triggerActions\n`
      + `*${stats.convos}* conversationStartedActions\n`,
      link_names: 1, parse: null
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

  controller.on('slash_command', function (bot, message) {
    if (message.command !== '/stats') {
      return;
    }
    stats.slashCommands++;

    bot.api.users.info({user: message.user_id}, (err, response) => {
      if (response.user.is_admin) {
        presentStats(bot, message);
      }
    });
  });
};
