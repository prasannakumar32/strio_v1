export const PRODUCTION_SITES = [
  {
    id: 'TIRUNELVELI',
    name: 'Tirunelveli Wind',
    fullName: 'M/S STRIO KAIZEN HITECH RESEARCH LABS PVT.LTD.',
    location: 'Tirunelveli',
    type: 'IS-CAPTIVE',
    serviceNumber: '079204721131',
    isRec: 'Non-Rec',
    machineCapacity: 600,
    netGeneration: 101732,
    category: 'IS-CAPTIVE',
    typeOfSS: 'TANGEDCO OWN SS',
    injectingVoltage: '33KV',
    historicalData: {
      '2025-01': {
        fromPowerplant: {
          C1: 11500,
          C2: 15500,
          C3: 0,
          C4: 46000,
          C5: 23000,
          total: 96000
        },
        fromBanking: {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          total: 0
        }
      },
      '2024-12': {
        fromPowerplant: {
          C1: 11000,
          C2: 15000,
          C3: 0,
          C4: 45000,
          C5: 22000,
          total: 93000
        },
        fromBanking: {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          total: 0
        }
      },
      '2024-11': {
        fromPowerplant: {
          C1: 10500,
          C2: 16000,
          C3: 0,
          C4: 43000,
          C5: 23000,
          total: 92500
        },
        fromBanking: {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          total: 0
        }
      }
    },
    unitValues: {
      fromPowerplant: {
        C1: 12127,
        C2: 17033,
        C3: 0,
        C4: 47727,
        C5: 24845,
        total: 101732
      },
      fromBanking: {
        C1: 0,
        C2: 0,
        C3: 0,
        C4: 0,
        C5: 1,
        total: 1
      }
    }
  },
  {
    id: 'PUDUKOTTAI',
    name: 'Pudukottai Solar',
    fullName: 'M/s.STRIO KAIZEN HITECH RESEARCH LABS (P) LTD',
    location: 'Pudukottai',
    type: 'IS-CAPTIVE',
    serviceNumber: '069534460069',
    isRec: 'Non-Rec',
    machineCapacity: 1000,
    multiplicationFactor: 1200,
    netGeneration: 166075,
    category: 'IS-CAPTIVE',
    typeOfSS: 'SECTION 10(1)SS',
    injectingVoltage: '22KV',
    lossPercent: 2.64,
    historicalData: {
      '2025-01': {
        fromPowerplant: {
          C1: 43000,
          C2: 0,
          C3: 0,
          C4: 120000,
          C5: 0,
          total: 163000
        },
        fromBanking: {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          total: 0
        }
      },
      '2024-12': {
        fromPowerplant: {
          C1: 42000,
          C2: 0,
          C3: 0,
          C4: 118000,
          C5: 0,
          total: 160000
        },
        fromBanking: {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          total: 0
        }
      },
      '2024-11': {
        fromPowerplant: {
          C1: 41000,
          C2: 0,
          C3: 0,
          C4: 115000,
          C5: 0,
          total: 156000
        },
        fromBanking: {
          C1: 0,
          C2: 0,
          C3: 0,
          C4: 0,
          C5: 0,
          total: 0
        }
      }
    },
    unitValues: {
      fromPowerplant: {
        C1: 44373,
        C2: 0,
        C3: 0,
        C4: 121702,
        C5: 0,
        total: 166075
      },
      fromBanking: {
        C1: 0,
        C2: 0,
        C3: 0,
        C4: 0,
        C5: 0,
        total: 0
      }
    }
  }
];

export const CONSUMPTION_SITES = [
  {
    id: 'CS1',
    name: 'POLYSPIN EXPORTS LTD.,EXPANSION UNIT.',
    location: 'VIRUDUNAGAR',
    type: 'Consumer',
    serviceNumber: '079094620335',
    allocated: 35820,
    historicalData: {
      '2024-12': {
        C1: 5000,
        C2: 0,
        C3: 0,
        C4: 29000,
        C5: 0,
        total: 34000
      },
      '2024-11': {
        C1: 4800,
        C2: 0,
        C3: 0,
        C4: 28000,
        C5: 0,
        total: 32800
      }
    },
    unitValues: {
      C1: 5254,
      C2: 0,
      C3: 0,
      C4: 30566,
      C5: 0,
      total: 35820
    }
  },
  {
    id: 'CS2',
    name: 'PEL TEXTILES',
    location: 'VIRUDUNAGAR',
    type: 'Consumer',
    serviceNumber: '079094620348',
    allocated: 8039,
    historicalData: {
      '2024-12': {
        C1: 0,
        C2: 0,
        C3: 0,
        C4: 7500,
        C5: 0,
        total: 7500
      },
      '2024-11': {
        C1: 0,
        C2: 0,
        C3: 0,
        C4: 7200,
        C5: 0,
        total: 7200
      }
    },
    unitValues: {
      C1: 0,
      C2: 0,
      C3: 0,
      C4: 8039,
      C5: 0,
      total: 8039
    }
  },
  {
    id: 'CS3',
    name: 'M/S. A RAMAR AND SONS',
    location: 'MADURAI METRO',
    type: 'Consumer',
    serviceNumber: '059094630184',
    allocated: 122216,
    historicalData: {
      '2024-12': {
        C1: 38000,
        C2: 0,
        C3: 0,
        C4: 80000,
        C5: 0,
        total: 118000
      },
      '2024-11': {
        C1: 37000,
        C2: 0,
        C3: 0,
        C4: 78000,
        C5: 0,
        total: 115000
      }
    },
    unitValues: {
      C1: 39119,
      C2: 0,
      C3: 0,
      C4: 83097,
      C5: 0,
      total: 122216
    }
  }
];
