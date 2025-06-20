const game = require('../data/gameState');

const allowedPhases = {
  give: 'negotiation',
  bid: 'council',
  revealbids: 'council',
  rotate: 'end'
};

module.exports = {
  name: 'nextphase',
  execute(message) {
    const phases = ['negotiation', 'council', 'edict', 'end'];
    const currentPhase = game.phase;

    const currentIndex = phases.indexOf(currentPhase);
    if (currentIndex === -1) {
      return message.channel.send(`⚠️ Unknown current phase: ${currentPhase}`);
    }

    const nextIndex = (currentIndex + 1) % phases.length;
    const nextPhase = phases[nextIndex];
    game.phase = nextPhase;

    let instructions = '';
    switch (nextPhase) {
      case 'negotiation':
        instructions = '🗣️ You may now negotiate and trade Influence freely for 5 minutes.';
        break;
      case 'council':
        instructions = '🏛️ Please return to your Councils and submit bids using `!bid`. Trading is now closed.';
        break;
      case 'edict':
        instructions = '📜 Chairs should now resolve Edicts based on the Constitution. Role abilities should be finalized.';
        break;
      case 'end':
        instructions = '🔁 Highest Bidders must move to the next Council. Use `!rotate`. Then use `!nextphase` to begin the next round.';
        break;
    }

    message.channel.send(`⏭️ **Phase Advanced:** Now in **${nextPhase.toUpperCase()} PHASE**\n${instructions}`);
  }
};
