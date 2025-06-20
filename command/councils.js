const game = require('../data/gameState');

module.exports = {
  name: 'councils',
  execute(message) {
    if (game.councils.length === 0) {
      return message.channel.send('There are currently no active councils. Players can use `!sit [number]` to join one.');
    }

    let output = '🏛️ **Current Councils**\n';
    game.councils.forEach((council, index) => {
      output += `\n**Council ${index + 1}**\n`;
      if (council.players.length === 0) {
        output += '  (no members)\n';
      } else {
        council.players.forEach((id, i) => {
          const player = game.players.get(id);
          const isChair = i === council.chairIndex;
          output += `  - ${player.username}${isChair ? ' 👑 (Chair)' : ''}\n`;
        });
      }
    });

    message.channel.send(output);
  }
};
