const game = require('../data/gameState');

module.exports = {
  name: 'startgame',
  execute(message) {
    game.players.clear();
    game.bids.clear();
    game.phase = 'setup';
    game.constitution = { Order: 0, Wealth: 0, Freedom: 0, Justice: 0 };
    message.channel.send('🎲 Coalition game started! Players can now `!join`.');
  }
};
