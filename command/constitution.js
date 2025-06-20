const game = require('../data/gameState');

module.exports = {
  name: 'constitution',
  execute(message) {
    const constitution = game.constitution;

    const scoreboard = `📜 **Constitution Scoreboard**

🟪 Order:   ${constitution.Order} Article(s)
🟨 Wealth:  ${constitution.Wealth} Article(s)
🟥 Freedom: ${constitution.Freedom} Article(s)
🟩 Justice: ${constitution.Justice} Article(s)`;

    message.channel.send(scoreboard);
  }
};
