'use strict';

const DEFAULT_GREETING = process.env.GREETING || 'Hello there!';
const WELCOME_NEW_MEMBER = (realName, channels) => `#{realName}, ${DEFAULT_GREETING}\n` + channels;

module.exports = function (controller) {

  controller.on('slash_command', function (bot, message) {
    if (message.command !== '/channels') {
      return;
    }
    bot.api.channels.list({}, (err, response) => {
      let output = '';
      const channels = [];

      response.channels.forEach(channel => {
        if (!channel.is_archived && channel.is_channel) {
          if (channel.topic.value.length == 0) {
            channels.push({
              name: channel.name,
              topic: 'topic_empty',
              members: channel.num_members
            });
          }
          else {
            channels.push({
              name: channel.name,
              topic: `${channel.topic.value.substr(0, 46)}...`,
              members: channel.num_members
            });
          }
        }
      });

      channels.sort((a, b) => {
        if (a.members <= b.members) {
          return 1;
        } else {
          return -1;
        }
      });
      channels.forEach(channel => {
        output += `#${channel.name} - \`${channel.topic}\` - [*${channel.members}*]\n`;
      });

      bot.replyPrivate(message, {text: output, link_names: 1, parse: null});
    });
  });
};
