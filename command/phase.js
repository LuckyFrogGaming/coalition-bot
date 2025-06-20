const game = require('../data/gameState');

module.exports = {
  name: 'phase',
  execute(message) {
    const phaseLabels = {
      negotiation: '🗣️ Negotiation Phase – Trade and discuss freely!',
      council: '🏛️ Council Phase – Submit bids and use role abilities.',
      edict: '📜 Edict Phase – Update the Constitution and resolve Edicts.',
      end: '🔁 End Phase – Move Highest Bidders to the next council.'
    };

    const current = game.phase || 'setup';
    const label = phaseLabels[current] || `⚠️ Unknown phase: ${current}`;

    message.channel.send(`📅 **Current Phase:** ${label}`);
  }
};
