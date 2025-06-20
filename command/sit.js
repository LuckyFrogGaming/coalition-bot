const game = require('../data/gameState');

module.exports = {
  name: 'sit',
  execute(message, args) {
    const player = game.players.get(message.author.id);
    if (!player) return message.reply('You need to `!join` the game first.');

    const councilNum = parseInt(args[0], 10);
    if (isNaN(councilNum) || councilNum < 1) {
      return message.reply('Please specify a valid council number, like `!sit 1`.');
    }

    // Ensure the council array is long enough
    while (game.councils.length < councilNum) {
      game.councils.push({ players: [], chairIndex: 0 });
    }

    // Remove player from any previous council
    game.councils.forEach(council => {
      const i = council.players.indexOf(message.author.id);
      if (i !== -1) council.players.splice(i, 1);
    });

    // Add player to new council
    game.councils[councilNum - 1].players.push(message.author.id);
    message.channel.send(`${player.username} has joined Council ${councilNum}.`);
  }
};
