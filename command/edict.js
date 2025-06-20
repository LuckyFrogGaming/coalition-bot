// commands/edict.js
const game = require('../data/gameState');

const thresholds = {
  2: 3,
  3: 4,
  4: 5
};

module.exports = {
  name: 'resolveedicts',
  execute(message) {
    const numCouncils = game.councils.length;
    const threshold = thresholds[numCouncils] || 3;
    const constitution = game.constitution;

    if (!game.edictState) {
      game.edictState = {
        previous: { WealthJustice: null, OrderFreedom: null },
        current: { WealthJustice: null, OrderFreedom: null }
      };
    }

    const report = ['📜 **Resolving Edicts for Each Council:**'];

    game.councils.forEach((council, i) => {
      const councilNum = i + 1;
      const players = council.players.map(id => game.players.get(id));
      const chairId = council.players[council.chairIndex];
      const chair = game.players.get(chairId);

      report.push(`\n\ud83c\udfe9 **Council ${councilNum}**`);

      // === WEALTH VS JUSTICE ===
      const wj = resolveVirtueSlot('Wealth', 'Justice', constitution, threshold, game.edictState.previous.WealthJustice, chair.username);
      game.edictState.current.WealthJustice = wj.virtue;
      report.push(`\n**Wealth vs. Justice**: ${wj.summary}`);
      applyEdictEffect(wj.virtue, wj.tier, players, chair, report);

      // === ORDER VS FREEDOM ===
      const of = resolveVirtueSlot('Order', 'Freedom', constitution, threshold, game.edictState.previous.OrderFreedom, chair.username);
      game.edictState.current.OrderFreedom = of.virtue;
      report.push(`\n**Order vs. Freedom**: ${of.summary}`);
      applyEdictEffect(of.virtue, of.tier, players, chair, report);
    });

    // Save current to previous
    game.edictState.previous = { ...game.edictState.current };

    message.channel.send(report.join('\n'));
  }
};

function resolveVirtueSlot(v1, v2, constitution, threshold, last, chairName) {
  const c1 = constitution[v1];
  const c2 = constitution[v2];
  let chosen;
  let note = '';

  if (c1 > c2) chosen = v1;
  else if (c2 > c1) chosen = v2;
  else {
    if (last === v1) chosen = v2;
    else if (last === v2) chosen = v1;
    else chosen = Math.random() > 0.5 ? v1 : v2;
    note = ` (tie — flipped from last round or randomly chosen)`;
  }

  const tier = constitution[chosen] >= threshold ? 'Greater' : 'Lesser';
  return {
    virtue: chosen,
    tier,
    summary: `${chosen} ${note} → **${tier} Edict**`
  };
}

function applyEdictEffect(virtue, tier, players, chair, report) {
  const key = virtue + tier;
  const handler = edictHandlers[key];
  if (handler) handler(players, chair, report);
  else report.push(`No handler implemented for ${key}`);
}

const edictHandlers = {
  OrderLesser: (players, chair, report) => {
    const types = ['Order', 'Wealth', 'Freedom', 'Justice'];
    const chosenType = types[Math.floor(Math.random() * types.length)];
    const target = players[Math.floor(Math.random() * players.length)];

    const toDiscard = target.influence.filter(v => v === chosenType);
    const kept = target.influence.filter(v => v !== chosenType);
    const gained = toDiscard.length;

    target.influence = [...kept];
    while (gained > 0) {
      const alt = types.filter(t => t !== chosenType)[Math.floor(Math.random() * 3)];
      target.influence.push(alt);
    }

    report.push(`🔒 **Sumptuary Law**: ${chair.username} chose ${target.username} to reveal & discard all ${chosenType}. Replaced with ${gained} cards of other types.`);
  },

  OrderGreater: (players, chair, report) => {
    const target = players[Math.floor(Math.random() * players.length)];
    report.push(`🏛 **Exile**: ${chair.username} chose ${target.username} to move next round.`);
    target._exiled = true;
  },

  WealthLesser: (players, chair, report) => {
    const target = players.find(p => p.id !== chair.id) || players[0];
    [chair, target].forEach(p => p.influence.push('Wealth', 'Wealth'));
    report.push(`🏦 **Donate**: ${chair.username} and ${target.username} each gain +2 Wealth.`);
  },

  WealthGreater: (players, chair, report) => {
    const hb = players[Math.floor(Math.random() * players.length)];
    const gain = Math.floor((hb.bid?.length || 2) / 2);
    [chair, hb].forEach(p => {
      for (let i = 0; i < gain; i++) p.influence.push('Wealth');
    });
    report.push(`💼 **Spoils**: ${chair.username} and ${hb.username} each gain +${gain} Wealth.`);
  },

  FreedomLesser: (players, chair, report) => {
    players.push(players.shift());
    report.push(`🌟 **Abdicate**: ${chair.username} moves to bottom of Council.`);
  },

  FreedomGreater: (players, chair, report) => {
    report.push(`🏛 **Depose**: ${chair.username} will move to next Council.`);
    chair._exiled = true;
  },

  JusticeLesser: (players, _chair, report) => {
    const amounts = players.map(p => ({ p, count: p.influence.length }));
    const max = Math.max(...amounts.map(a => a.count));
    const gainers = amounts.filter(a => a.count < max);
    gainers.forEach(a => a.p.influence.push('Justice'));
    report.push(`📄 **Alms**: ${gainers.map(g => g.p.username).join(', ')} each gain 1 Justice.`);
  },

  JusticeGreater: (players, chair, report) => {
    const allInfluence = players.flatMap(p => p.influence);
    shuffleArray(allInfluence);
    const split = Math.floor(allInfluence.length / players.length);
    players.forEach(p => p.influence = allInfluence.splice(0, split));
    report.push(`📆 **Redistribute**: ${chair.username} shuffled and redistributed all Influence equally.`);
  }
};

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
