const game = require('../data/gameState');

module.exports = {
  name: 'rotate',
  execute(message) {
    if (game.phase !== 'end') {
      return message.channel.send('⛔ Players can only rotate councils during the End Phase.');
    }

    if (game.councils.length === 0) {
      return message.channel.send('There are no councils to rotate through.');
    }

    let movedPlayers = [];

    for (let i = 0; i < game.councils.length; i++) {
      const council = game.councils[i];
      if (council.players.length === 0) continue;

      const chairIndex = council.chairIndex ?? 0;
      const moverId = council.players[chairIndex];
      if (!moverId) continue;

      const nextCouncilIndex = (i + 1) % game.councils.length;

      council.players.splice(chairIndex, 1);
      game.councils[nextCouncilIndex].players.push(moverId);
      movedPlayers.push({ name: game.players.get(moverId).username, from: i + 1, to: nextCouncilIndex + 1 });
    }

    game.councils.forEach(c => c.chairIndex = 0);

    if (movedPlayers.length === 0) {
      return message.channel.send('No players were moved. Make sure each council has a Chair.');
    }

    let summary = '🔁 **Council Movement:**\n';
    movedPlayers.forEach(p => {
      summary += `- ${p.name} moved from Council ${p.from} to Council ${p.to}\n`;
    });

    message.channel.send(summary);
  }
};
