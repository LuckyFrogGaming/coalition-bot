const game = require('../data/gameState');

module.exports = {
  name: 'join',
  execute(message) {
    if (game.players.has(message.author.id)) {
      message.reply('You already joined the game!');
      return;
    }
    game.players.set(message.author.id, {
      id: message.author.id,
      username: message.author.username,
      party: null,
      role: null,
      influence: []
    });
    message.channel.send(`${message.author.username} has joined the Coalition!`);
  }
};
