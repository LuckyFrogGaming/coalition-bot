const game = require('../data/gameState');

module.exports = {
  name: 'bid',
  execute(message, args) {
    if (game.phase !== 'council') {
      return message.reply('⛔ You can only submit bids during the Council Phase.');
    }

    const player = game.players.get(message.author.id);
    if (!player) return message.reply('You must join the game first with `!join`.');
    if (!player.party) return message.reply('Wait until parties have been assigned.');

    const bidVirtues = args;
    const bid = [];
    for (const virtue of bidVirtues) {
      const idx = player.influence.indexOf(virtue);
      if (idx === -1) return message.reply(`You don't have enough ${virtue} to bid.`);
      player.influence.splice(idx, 1);
      bid.push(virtue);
    }

    game.bids.set(message.author.id, bid);
    message.reply(`✅ Bid received privately with ${bid.length} influence.`);
  }
};
