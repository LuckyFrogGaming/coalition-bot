const game = require('../data/gameState');

module.exports = {
  name: 'players',
  execute(message) {
    const playerList = [...game.players.values()].map(p => {
      const inf = p.influence.length > 0 ? ` [${p.influence.join(', ')}]` : '';
      return `- ${p.username}${p.party ? ` (${p.party})` : ''}${inf}`;
    }).join('\n');

    message.channel.send(`👥 Current players:\n${playerList}`);
  }
};
