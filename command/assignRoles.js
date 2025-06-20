const game = require('../data/gameState');

module.exports = {
  name: 'assignroles',
  execute(message) {
    const playersWithoutParty = [...game.players.values()].filter(p => !p.party);
    if (playersWithoutParty.length > 0) return message.channel.send('Assign parties first using `!assignparties`.');

    for (const player of game.players.values()) {
      const availableRoles = game.roles[player.party];
      const randomRole = availableRoles[Math.floor(Math.random() * availableRoles.length)];
      player.role = randomRole;
    }

    message.channel.send('🎭 Roles have been assigned randomly to each player! Use `!players` to check.');
  }
};