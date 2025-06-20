const game = require('../data/gameState');

module.exports = {
  name: 'revealbids',
  execute(message) {
    if (game.phase !== 'council') {
      return message.channel.send('⛔ Bids can only be revealed during the Council Phase.');
    }

    if (game.bids.size === 0) return message.channel.send('No bids have been placed yet.');
    if (!game.councils || game.councils.length === 0) return message.channel.send('No councils are defined.');

    let fullReport = '📜 **Council Bids Revealed:**\n';

    game.councils.forEach((council, councilIndex) => {
      fullReport += `\n🏛️ **Council ${councilIndex + 1}**\n`;

      let virtueTotals = { Order: 0, Wealth: 0, Freedom: 0, Justice: 0 };
      let councilBids = [];
      let maxBid = 0;
      let maxBidders = [];

      council.players.forEach((playerId) => {
        const bid = game.bids.get(playerId) || [];
        const player = game.players.get(playerId);
        councilBids.push({ id: playerId, username: player.username, bid });

        bid.forEach(v => virtueTotals[v]++);
        if (bid.length > maxBid) {
          maxBid = bid.length;
          maxBidders = [playerId];
        } else if (bid.length === maxBid) {
          maxBidders.push(playerId);
        }
      });

      councilBids.forEach(entry => {
        fullReport += `- ${entry.username}: ${entry.bid.join(', ') || '(no bid)'}\n`;
      });

      fullReport += '\n🧮 **Virtue Totals:**\n';
      for (const [virtue, count] of Object.entries(virtueTotals)) {
        fullReport += `- ${virtue}: ${count}\n`;
      }

      const sortedVirtues = Object.entries(virtueTotals).sort((a, b) => b[1] - a[1]);
      const topCount = sortedVirtues[0][1];
      const topVirtues = sortedVirtues.filter(([_, count]) => count === topCount);

      let winningVirtue;
      const tiebreak = game.tieBreaks?.[councilIndex]?.virtue;
      if (topVirtues.length === 1) {
        winningVirtue = topVirtues[0][0];
      } else if (tiebreak && topVirtues.some(([v]) => v === tiebreak)) {
        winningVirtue = tiebreak;
        fullReport += `⚖️ Tie broken by Chair: ${tiebreak}\n`;
      } else {
        winningVirtue = topVirtues[0][0];
        fullReport += `⚠️ Tie not broken — defaulting to ${winningVirtue}\n`;
      }

      game.constitution[winningVirtue]++;
      fullReport += `\n🏛️ **Winning Virtue:** ${winningVirtue}\n`;

      let highestBidder;
      if (maxBidders.length === 1) {
        highestBidder = game.players.get(maxBidders[0]).username;
      } else {
        const hbTiebreak = game.tieBreaks?.[councilIndex]?.highestBidder;
        if (hbTiebreak && maxBidders.includes(hbTiebreak)) {
          highestBidder = game.players.get(hbTiebreak).username;
          fullReport += `👑 Chair broke highest bidder tie in favor of ${highestBidder}\n`;
        } else {
          highestBidder = game.players.get(maxBidders[0]).username;
          fullReport += `⚠️ Highest bidder tie not broken — defaulting to ${highestBidder}\n`;
        }
      }

      fullReport += `👑 **Highest Bidder:** ${highestBidder}\n`;
    });

    fullReport += `\n📜 **Updated Constitution:** Order(${game.constitution.Order}), Wealth(${game.constitution.Wealth}), Freedom(${game.constitution.Freedom}), Justice(${game.constitution.Justice})`;

    game.bids.clear();
    message.channel.send(fullReport);
  }
};
