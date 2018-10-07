'use strict';

module.exports = function (controller) {

  controller.hears(['form'], 'direct_message,direct_mention', function (bot, message) {
    bot.reply(message, {
      attachments: [
        {
          title: 'Do you want to interact with my buttons?',
          callback_id: '123',
          attachment_type: 'default',
          actions: [
            {
              'name': 'yes',
              'text': 'Yes',
              'value': 'yes',
              'type': 'button',
            },
            {
              'name': 'no',
              'text': 'No',
              'value': 'no',
              'type': 'button',
            }
          ]
        }
      ]
    });
  });

  controller.on('member_joined_channel', function (bot, message) {

    bot.api.channels.info({ channel: message.channel }, function (err, response) {
      console.log(response);
      if (response.channel.name === 'hello') {
        bot.startConversation(message, function (err, convo) {
          convo.say('Better take this private...');
          convo.say({
            ephemeral: true, attachments: [
              {
                title: 'Do you want to interact with my buttons?',
                callback_id: '123',
                attachment_type: 'default',
                actions: [
                  {
                    'name': 'yes',
                    'text': 'Yes',
                    'value': 'yes',
                    'type': 'button',
                  },
                  {
                    'name': 'no',
                    'text': 'No',
                    'value': 'no',
                    'type': 'button',
                  }
                ]
              }
            ]
          });
        });
      }
    });

  });

  controller.on('interactive_message_callback', function (bot, message) {
    if (message.callback_id === '123') {
      console.log(message);
      var dialog = bot.createDialog(
        'GDC Bot',
        '123',
        'Submit'
      ).addText('Text', 'text', 'some text')
        .addSelect('Select', 'select', null, [{ label: 'Foo', value: 'foo' }, {
          label: 'Bar',
          value: 'bar'
        }], { placeholder: 'Select One' })
        .addTextarea('Textarea', 'textarea', 'some longer text', { placeholder: 'Put words here' })
        .addUrl('Website', 'url', 'http://greekdigitalcommunity.com');

      bot.replyWithDialog(message, dialog.asObject());
    }
  });

  controller.on('dialog_submission', function handler(bot, message) {
    // bot.replyPrivate(message, 'Got it!');
    if (message.callback_id === '123') {
      console.log(message);
      bot.sendEphemeral({
        channel: 'hello',
        user: message.user,
        replace_original: true,
        text: 'Pssst! You my friend, are a true Bot Champion!'
      });
    }

    // call dialogOk or else Slack will think this is an error
    bot.dialogOk();
  });
};
