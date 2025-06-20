const game = require('../data/gameState');

module.exports = {
  name: 'assignparties',
  execute(message) {
    const playerArray = [...game.players.values()];
    if (playerArray.length < 4) return message.channel.send('You need at least 4 players to assign parties.');

    const shuffledPlayers = playerArray.sort(() => 0.5 - Math.random());
    const partyCount = game.parties.length;

    shuffledPlayers.forEach((player, index) => {
      const assignedParty = game.parties[index % partyCount];
      player.party = assignedParty;
      player.influence = game.partyVirtues[assignedParty].flatMap(v => [v, v]);
    });

    message.channel.send('🧑‍⚖️ Parties have been assigned! Influence has been distributed. Use `!players` to view.');
  }
};