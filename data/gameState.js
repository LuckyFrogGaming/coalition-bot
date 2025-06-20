module.exports = {
  players: new Map(),
  phase: 'setup',
  councils: [],
  constitution: { Order: 0, Wealth: 0, Freedom: 0, Justice: 0 },
  parties: ['Clergy', 'Nobles', 'Merchants', 'Rebels'],
  partyVirtues: {
    Clergy: ['Justice', 'Order'],
    Nobles: ['Order', 'Wealth'],
    Merchants: ['Wealth', 'Freedom'],
    Rebels: ['Freedom', 'Justice']
  },
  roles: {
    Clergy: ['Friar', 'Bishop', 'Inquisitor'],
    Nobles: ['Duke', 'Knight', 'Magistrate'],
    Merchants: ['Investor', 'Guildmaster', 'Banker'],
    Rebels: ['Revolutionary', 'Iconoclast', 'Advocate']
  },
  edictState: {
  previous: {
    'WealthJustice': null,
    'OrderFreedom': null
  },
  current: {
    'WealthJustice': null,
    'OrderFreedom': null
  }
},
  bids: new Map()
  
};
