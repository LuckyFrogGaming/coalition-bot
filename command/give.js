const game = require('../data/gameState');

module.exports = {
  name: 'give',
  execute(message, args) {
    if (game.phase !== 'negotiation') {
      return message.channel.send('⛔ You can only give Influence during the Negotiation Phase.');
    }

    const target = message.mentions.users.first();
    const virtue = args[1];
    const player = game.players.get(message.author.id);
    const recipient = target ? game.players.get(target.id) : null;

    if (!player || !recipient || !virtue) return message.channel.send('Usage: `!give @player Virtue`');
    const index = player.influence.indexOf(virtue);
    if (index === -1) return message.channel.send(`You don't have any ${virtue} influence to give.`);

    player.influence.splice(index, 1);
    recipient.influence.push(virtue);
    message.channel.send(`${player.username} gave 1 ${virtue} influence to ${recipient.username}.`);
  }
};
