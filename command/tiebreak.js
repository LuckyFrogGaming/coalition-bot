const game = require('../data/gameState');

module.exports = {
  name: 'tiebreak',
  execute(message, args) {
    const virtueOptions = ['Order', 'Wealth', 'Freedom', 'Justice'];
    const chosenVirtue = args[0];

    if (!chosenVirtue || !virtueOptions.includes(chosenVirtue)) {
      return message.reply('Please provide a valid Virtue to break the tie: Order, Wealth, Freedom, or Justice.');
    }

    const playerId = message.author.id;
    const playerCouncilIndex = game.councils.findIndex(c => c.players.includes(playerId));
    if (playerCouncilIndex === -1) {
      return message.reply("You're not currently seated in a council.");
    }

    const isChair = game.councils[playerCouncilIndex].players[0] === playerId;
    if (!isChair) {
      return message.reply('Only the Council Chair can break ties.');
    }

    game.tieBreaks = game.tieBreaks || {};
    game.tieBreaks[playerCouncilIndex] = {
      virtue: chosenVirtue,
      highestBidder: playerId, // optional if you want to use this
      by: game.players.get(playerId).username
    };

    message.channel.send(`👑 ${game.players.get(playerId).username} (Chair of Council ${playerCouncilIndex + 1}) has broken the tie in favor of **${chosenVirtue}**.`);
  }
};
