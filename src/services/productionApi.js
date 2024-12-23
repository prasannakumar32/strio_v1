// Mock production sites data
const MOCK_PRODUCTION_SITES = {
  'PW1': {
    id: 'PW1',
    name: 'Tirunelveli Windmill',
    type: 'Wind',
    location: 'Tirunelveli',
    capacity: 600,
    capacityUnit: 'kW',
    efficiency: 92,
    serviceNumber: '079204721131',
    isRec: true,
    companyName: 'M/s Strio Kaizen Hitech Research Labs Pvt Ltd',
    allowLowerAdjustmentSlot: true,
    injectionVoltage: 33, // in kV
    category: 'Captive',
    typeOfSS: 'TANGEDCO Own SS',
    netGeneration: 101732,
    machineCapacity: 600, // in kW
    status: 'active',
    coordinates: {
      latitude: 8.7139,
      longitude: 77.7567
    },
    lastUpdated: '2023-12-08T14:58:28+05:30'
  },
  'PS1': {
    id: 'PS1',
    name: 'Pudukottai Solar Panel',
    type: 'Solar',
    location: 'Pudukottai',
    capacity: 1000,
    capacityUnit: 'kW',
    efficiency: 85,
    serviceNumber: '069534460069',
    isRec: false,
    companyName: 'M/s Strio Kaizen Hitech Research Labs Pvt Ltd',
    allowLowerAdjustmentSlot: true,
    injectionVoltage: 22, // in kV
    category: 'Captive',
    typeOfSS: 'Section 10(1)SS',
    netGeneration: 166075,
    machineCapacity: 1000, // in kW
    status: 'active',
    coordinates: {
      latitude: 10.3833,
      longitude: 78.8001
    },
    lastUpdated: '2023-12-08T14:58:28+05:30'
  },
  'PW2': {
    id: 'PW2',
    name: 'Coimbatore Wind Farm',
    type: 'Wind',
    location: 'Coimbatore',
    capacity: 800,
    capacityUnit: 'kW',
    efficiency: 88,
    serviceNumber: '082156789012',
    isRec: true,
    companyName: 'M/s Strio Kaizen Hitech Research Labs Pvt Ltd',
    allowLowerAdjustmentSlot: true,
    injectionVoltage: 33,
    category: 'Captive',
    typeOfSS: 'TANGEDCO Own SS',
    netGeneration: 143500,
    machineCapacity: 800,
    status: 'active',
    coordinates: {
      latitude: 11.0168,
      longitude: 76.9558
    },
    lastUpdated: '2023-12-08T14:58:28+05:30'
  },
  'PS2': {
    id: 'PS2',
    name: 'Madurai Solar Park',
    type: 'Solar',
    location: 'Madurai',
    capacity: 1200,
    capacityUnit: 'kW',
    efficiency: 87,
    serviceNumber: '075698234567',
    isRec: true,
    companyName: 'M/s Strio Kaizen Hitech Research Labs Pvt Ltd',
    allowLowerAdjustmentSlot: true,
    injectionVoltage: 22,
    category: 'Captive',
    typeOfSS: 'Section 10(1)SS',
    netGeneration: 188900,
    machineCapacity: 1200,
    status: 'active',
    coordinates: {
      latitude: 9.9252,
      longitude: 78.1198
    },
    lastUpdated: '2023-12-08T14:58:28+05:30'
  },
  'PW3': {
    id: 'PW3',
    name: 'Thoothukudi Wind Energy',
    type: 'Wind',
    location: 'Thoothukudi',
    capacity: 750,
    capacityUnit: 'kW',
    efficiency: 90,
    serviceNumber: '091234567890',
    isRec: false,
    companyName: 'M/s Strio Kaizen Hitech Research Labs Pvt Ltd',
    allowLowerAdjustmentSlot: true,
    injectionVoltage: 33,
    category: 'Captive',
    typeOfSS: 'TANGEDCO Own SS',
    netGeneration: 134800,
    machineCapacity: 750,
    status: 'active',
    coordinates: {
      latitude: 8.7642,
      longitude: 78.1348
    },
    lastUpdated: '2023-12-08T14:58:28+05:30'
  },
  'PS3': {
    id: 'PS3',
    name: 'Salem Solar Field',
    type: 'Solar',
    location: 'Salem',
    capacity: 900,
    capacityUnit: 'kW',
    efficiency: 86,
    serviceNumber: '088765432109',
    isRec: true,
    companyName: 'M/s Strio Kaizen Hitech Research Labs Pvt Ltd',
    allowLowerAdjustmentSlot: true,
    injectionVoltage: 22,
    category: 'Captive',
    typeOfSS: 'Section 10(1)SS',
    netGeneration: 155600,
    machineCapacity: 900,
    status: 'active',
    coordinates: {
      latitude: 11.6643,
      longitude: 78.1460
    },
    lastUpdated: '2023-12-08T14:58:28+05:30'
  }
};

// Mock historical data for sites
const MOCK_HISTORICAL_DATA = {
  'PS1': [
    {
      month: 'Jul',
      year: 2023,
      c1: 8200,
      c2: 7700,
      c3: 7300,
      c4: 6900,
      production: 30100,
      notes: "Peak summer production"
    },
    {
      month: 'Aug',
      year: 2023,
      c1: 8100,
      c2: 7600,
      c3: 7200,
      c4: 6800,
      production: 29700,
      notes: "Regular performance"
    },
    {
      month: 'Sep',
      year: 2023,
      c1: 7900,
      c2: 7400,
      c3: 7000,
      c4: 6600,
      c001: 1250,
      c002: 1150,
      c003: 1050,
      c004: 950,
      c005: 850,
      c006: 750,
      c007: 650,
      c008: 550,
      production: 28900,
      notes: "Monsoon impact"
    },
    {
      month: 'Oct',
      year: 2023,
      c1: 7800,
      c2: 7300,
      c3: 6900,
      c4: 6500,
      c001: 1200,
      c002: 1100,
      c003: 1000,
      c004: 900,
      c005: 800,
      c006: 700,
      c007: 600,
      c008: 500,
      production: 28500,
      notes: "Post-monsoon recovery"
    },
    {
      month: 'Nov',
      year: 2023,
      c1: 8000,
      c2: 7500,
      c3: 7100,
      c4: 6700,
      c001: 1300,
      c002: 1200,
      c003: 1100,
      c004: 1000,
      c005: 900,
      c006: 800,
      c007: 700,
      c008: 600,
      production: 29300,
      notes: "Stable production"
    },
    {
      month: 'Dec',
      year: 2023,
      c1: 8300,
      c2: 7800,
      c3: 7400,
      c4: 7000,
      c001: 1400,
      c002: 1300,
      c003: 1200,
      c004: 1100,
      c005: 1000,
      c006: 900,
      c007: 800,
      c008: 700,
      production: 30500,
      notes: "Year-end peak"
    }
  ],
  'PW1': [
    {
      month: 'Jul',
      year: 2023,
      c1: 8800,
      c2: 8300,
      c3: 7900,
      c4: 7500,
      c001: 1450,
      c002: 1350,
      c003: 1250,
      c004: 1150,
      c005: 1050,
      c006: 950,
      c007: 850,
      c008: 750,
      production: 32500,
      notes: "Strong wind conditions"
    },
    {
      month: 'Aug',
      year: 2023,
      c1: 8900,
      c2: 8400,
      c3: 8000,
      c4: 7600,
      c001: 1500,
      c002: 1400,
      c003: 1300,
      c004: 1200,
      c005: 1100,
      c006: 1000,
      c007: 900,
      c008: 800,
      production: 32900,
      notes: "Peak wind season"
    },
    {
      month: 'Sep',
      year: 2023,
      c1: 8700,
      c2: 8200,
      c3: 7800,
      c4: 7400,
      c001: 1470,
      c002: 1370,
      c003: 1270,
      c004: 1170,
      c005: 1070,
      c006: 970,
      c007: 870,
      c008: 770,
      production: 32100,
      notes: "Consistent winds"
    },
    {
      month: 'Oct',
      year: 2023,
      c1: 8600,
      c2: 8100,
      c3: 7700,
      c4: 7300,
      c001: 1420,
      c002: 1320,
      c003: 1220,
      c004: 1120,
      c005: 1020,
      c006: 920,
      c007: 820,
      c008: 720,
      production: 31700,
      notes: "Moderate winds"
    },
    {
      month: 'Nov',
      year: 2023,
      c1: 8400,
      c2: 7900,
      c3: 7500,
      c4: 7100,
      c001: 1380,
      c002: 1280,
      c003: 1180,
      c004: 1080,
      c005: 980,
      c006: 880,
      c007: 780,
      c008: 680,
      production: 30900,
      notes: "Seasonal variation"
    },
    {
      month: 'Dec',
      year: 2023,
      c1: 8200,
      c2: 7700,
      c3: 7300,
      c4: 6900,
      c001: 1350,
      c002: 1250,
      c003: 1150,
      c004: 1050,
      c005: 950,
      c006: 850,
      c007: 750,
      c008: 650,
      production: 30100,
      notes: "Year-end performance"
    }
  ]
};

// Mock site details data
const mockHistoricalData = [
  {
    month: 'Jul',
    year: 2023,
    c1: 150,
    c2: 180,
    c3: 200,
    c4: 160,
    c001: 45,
    c002: 55,
    c003: 65,
    c004: 75,
    c005: 85,
    c006: 95,
    c007: 105,
    c008: 115
  },
  {
    month: 'Aug',
    year: 2023,
    c1: 160,
    c2: 190,
    c3: 210,
    c4: 170,
    c001: 48,
    c002: 58,
    c003: 68,
    c004: 78,
    c005: 88,
    c006: 98,
    c007: 108,
    c008: 118
  },
  {
    month: 'Sep',
    year: 2023,
    c1: 155,
    c2: 185,
    c3: 205,
    c4: 165,
    c001: 46,
    c002: 56,
    c003: 66,
    c004: 76,
    c005: 86,
    c006: 96,
    c007: 106,
    c008: 116
  },
  {
    month: 'Oct',
    year: 2023,
    c1: 165,
    c2: 195,
    c3: 215,
    c4: 175,
    c001: 50,
    c002: 60,
    c003: 70,
    c004: 80,
    c005: 90,
    c006: 100,
    c007: 110,
    c008: 120
  },
  {
    month: 'Nov',
    year: 2023,
    c1: 170,
    c2: 200,
    c3: 220,
    c4: 180,
    c001: 52,
    c002: 62,
    c003: 72,
    c004: 82,
    c005: 92,
    c006: 102,
    c007: 112,
    c008: 122
  },
  {
    month: 'Dec',
    year: 2023,
    c1: 175,
    c2: 205,
    c3: 225,
    c4: 185,
    c001: 54,
    c002: 64,
    c003: 74,
    c004: 84,
    c005: 94,
    c006: 104,
    c007: 114,
    c008: 124
  }
];

// Mock site details data
const MOCK_SITE_DETAILS = {
  'PW1': {
    id: 'PW1',
    name: 'Tirunelveli Windmill',
    type: 'WIND',
    location: 'Tirunelveli, Tamil Nadu',
    capacity: 9000,
    capacityUnit: 'units',
    efficiency: 92,
    serviceNumber: '0724024721131',
    isRec: true,
    companyName: 'M/s Strio Kaizen Hitech Research Labs Pvt Ltd',
    allowLowerAdjustmentSlot: true,
    injectionVoltage: 110, // in kV
    status: 'active',
    banking: true,
    statement: "Strategic wind energy generation in Tirunelveli",
    historicalData: mockHistoricalData
  },
  'PS1': {
    id: 'PS1',
    name: 'Pudukottai Solar Panel',
    type: 'SOLAR',
    location: 'Pudukottai, Tamil Nadu',
    capacity: 8500,
    capacityUnit: 'units',
    efficiency: 85,
    serviceNumber: '069534460069',
    isRec: true,
    companyName: 'M/s Strio Kaizen Hitech Research Labs Pvt Ltd',
    allowLowerAdjustmentSlot: true,
    injectionVoltage: 110, // in kV
    status: 'active',
    banking: true,
    statement: "Large-scale solar power generation in Pudukottai",
    historicalData: mockHistoricalData
  }
};

// Mock consumption data structure
const MOCK_CONSUMPTION_DATA = {
  'PS1': [
    {
      month: 'Dec',
      year: 2023,
      c1: '12000 units',
      c2: '11000 units',
      c3: '11500 units',
      c4: '10500 units',
      totalConsumption: '45000 units',
      dailyAverage: '1500 units',
      peakDemand: '2200 units'
    },
    {
      month: 'Nov',
      year: 2023,
      c1: '11500 units',
      c2: '10800 units',
      c3: '11200 units',
      c4: '10200 units',
      totalConsumption: '43700 units',
      dailyAverage: '1457 units',
      peakDemand: '2100 units'
    }
  ],
  'PW1': [
    {
      month: 'Dec',
      year: 2023,
      c1: '13000 units',
      c2: '12500 units',
      c3: '12800 units',
      c4: '11900 units',
      totalConsumption: '50200 units',
      dailyAverage: '1673 units',
      peakDemand: '2400 units'
    }
  ]
};

// Mock allocation data structure
const MOCK_ALLOCATION_DATA = {
  'PS1': {
    currentMonth: {
      production: '30500 units',
      consumption: '45000 units',
      banking: {
        available: '5000 units',
        expiry: '2024-03-31',
        isPeakHour: false
      },
      allocation: {
        peak: {
          available: '15000 units',
          allocated: '12000 units',
          remaining: '3000 units'
        },
        nonPeak: {
          available: '15500 units',
          allocated: '13000 units',
          remaining: '2500 units'
        }
      }
    }
  },
  'PW1': {
    currentMonth: {
      production: '32900 units',
      consumption: '52000 units',
      banking: {
        available: '8000 units',
        expiry: '2024-03-31',
        isPeakHour: false,
        allowBanking: true
      },
      allocation: {
        peak: {
          available: '16000 units',
          allocated: '14000 units',
          remaining: '2000 units'
        },
        nonPeak: {
          available: '16900 units',
          allocated: '15000 units',
          remaining: '1900 units'
        }
      }
    }
  }
};

// Define MOCK_CONSUMPTION_SITES once
const MOCK_CONSUMPTION_SITES = [
  {
    id: 'C1',
    name: 'Polyspin Exports Ltd Expansion Unit',
    type: 'INDUSTRIAL',
    location: 'Rajapalayam',
    capacity: 200,
    status: 'active',
    banking: 'Yes',
    serviceNumber: '069534460069',
    isRec: true,
    companyName: 'M/s Strio Kaizen Hitech Research Labs Pvt Ltd',
    grid: 'Tamil Nadu Grid',
    historicalData: [
      {
        month: 'Jul',
        year: 2023,
        c1: 8200,
        c2: 7700,
        c3: 7300,
        c4: 6900,
        c5: 6500
      },
      {
        month: 'Aug',
        year: 2023,
        c1: 8100,
        c2: 7600,
        c3: 7200,
        c4: 6800,
        c5: 6400
      }
    ]
  },
  {
    id: 'C2',
    name: 'PEL Textiles',
    type: 'INDUSTRIAL',
    location: 'Rajapalayam',
    capacity: 180,
    status: 'active',
    banking: 'Yes',
    serviceNumber: '069534460070',
    isRec: true,
    companyName: 'M/s Strio Kaizen Hitech Research Labs Pvt Ltd',
    grid: 'Tamil Nadu Grid',
    historicalData: [
      // Similar historical data
    ]
  },
  {
    id: 'C3',
    name: 'M/s Ramar and Sons',
    type: 'INDUSTRIAL',
    location: 'Rajapalayam',
    capacity: 150,
    status: 'active',
    banking: 'Yes',
    serviceNumber: '069534460071',
    isRec: true,
    companyName: 'M/s Strio Kaizen Hitech Research Labs Pvt Ltd',
    grid: 'Tamil Nadu Grid',
    historicalData: [
      // Similar historical data
    ]
  }
];

// API methods
const productionApi = {
  // Get user's production sites
  async getUserProductionSites() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.assignedSites) {
      return {
        success: false,
        message: 'User not found or no sites assigned'
      };
    }

    const userSites = Object.values(MOCK_PRODUCTION_SITES).filter(site =>
      user.assignedSites.production.includes(site.id)
    );

    return {
      success: true,
      data: userSites,
      source: 'mock'
    };
  },

  // Get user's consumption sites
  async getUserConsumptionSites() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.assignedSites) {
      return {
        success: false,
        message: 'User not found or no sites assigned'
      };
    }

    const userSites = MOCK_CONSUMPTION_SITES.filter(site =>
      user.assignedSites.consumption.includes(site.id)
    );

    return {
      success: true,
      data: userSites,
      source: 'mock'
    };
  },

  // Get all production sites (for admin)
  async getAllProductionSites() {
    return {
      success: true,
      data: Object.values(MOCK_PRODUCTION_SITES),
      source: 'mock'
    };
  },

  // Get all consumption sites (for admin)
  async getAllConsumptionSites() {
    return {
      success: true,
      data: MOCK_CONSUMPTION_SITES,
      source: 'mock'
    };
  }
};

const formatProductionData = (data) => {
  return {
    ...data,
    production: data.production + ' units',
    c1: data.c1 + ' units',
    c2: data.c2 + ' units',
    c3: data.c3 + ' units',
    c4: data.c4 + ' units',
    c001: data.c001 + ' units',
    c002: data.c002 + ' units',
    c003: data.c003 + ' units',
    c004: data.c004 + ' units',
    c005: data.c005 + ' units',
    c006: data.c006 + ' units',
    c007: data.c007 + ' units',
    c008: data.c008 + ' units'
  };
};

const fetchSiteDetails = async (siteId) => {
  try {
    const site = MOCK_SITE_DETAILS[siteId];
    if (!site) {
      throw new Error('Site not found');
    }

    return {
      ...site,
      historicalData: site.historicalData.map(formatProductionData)
    };
  } catch (error) {
    console.error('Error fetching site details:', error);
    throw error;
  }
};

const fetchSiteHistoricalData = async (siteId) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const historicalData = mockHistoricalData;

    if (!historicalData) {
      return [];
    }

    return historicalData;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw new Error('Failed to fetch historical data');
  }
};

const validateProductionData = (data) => {
  const errors = {};
  const requiredFields = [
    'c1', 'c2', 'c3', 'c4',
    'c001', 'c002', 'c003', 'c004',
    'c005', 'c006', 'c007', 'c008'
  ];

  requiredFields.forEach(field => {
    if (!data[field] || data[field] <= 0) {
      errors[field] = `${field} is required and must be greater than 0`;
    }
  });

  return { isValid: Object.keys(errors).length === 0, errors };
};

// Dashboard card data formatter
export const formatDashboardData = (data) => {
  return {
    production: data.production ? data.production + ' units' : '0 units',
    allocation: data.allocation ? data.allocation + ' units' : '0 units',
    consumption: data.consumption ? data.consumption + ' units' : '0 units'
  };
};

// Allocation rules
const ALLOCATION_RULES = {
  isPeakHour: (time) => {
    const hour = parseInt(time.split(':')[0]);
    return (hour >= 6 && hour < 10) || (hour >= 18 && hour < 22);
  },

  canAllocate: (source, target, amount, isPeak) => {
    // Check if allocation is within the same period
    if (source.month !== target.month || source.year !== target.year) {
      return { allowed: false, reason: 'Allocation must be within the same period' };
    }

    // Peak to non-peak is allowed, but not vice versa
    if (!source.isPeak && target.isPeak) {
      return { allowed: false, reason: 'Non-peak units cannot be allocated to peak hours' };
    }

    // Check if enough units are available
    if (source.available < amount) {
      return { allowed: false, reason: 'Insufficient units available' };
    }

    return { allowed: true };
  },

  canBank: (siteId, amount) => {
    const site = MOCK_ALLOCATION_DATA[siteId];
    return site?.currentMonth?.banking?.allowBanking || false;
  }
};

// Allocation handler
export const handleAllocation = async (allocation) => {
  try {
    const { sourceId, targetId, amount, isPeak } = allocation;

    // Convert amount to number if it's a string
    const units = parseInt(amount);
    if (isNaN(units) || units <= 0) {
      throw new Error('Invalid allocation amount');
    }

    // Get current allocation data
    if (!MOCK_ALLOCATION_DATA[sourceId] || !MOCK_ALLOCATION_DATA[targetId]) {
      throw new Error('Invalid source or target site');
    }

    const source = MOCK_ALLOCATION_DATA[sourceId].currentMonth;
    const target = MOCK_ALLOCATION_DATA[targetId].currentMonth;

    // Validate allocation rules
    const type = isPeak ? 'peak' : 'nonPeak';

    if (source.allocation[type].available < units) {
      throw new Error(`Insufficient ${type} units available for allocation`);
    }

    // For banking allocation (same source and target)
    if (sourceId === targetId) {
      if (!source.banking.allowBanking) {
        throw new Error('Banking is not allowed for this site');
      }

      // Update banking
      const newBankingAvailable = parseInt(source.banking.available.split(' ')[0]) + units;
      source.banking.available = `${newBankingAvailable} units`;

      // Reduce from available allocation
      const newAvailable = parseInt(source.allocation[type].available.split(' ')[0]) - units;
      source.allocation[type].available = `${newAvailable} units`;

      // Update remaining
      const newRemaining = parseInt(source.allocation[type].remaining.split(' ')[0]) - units;
      source.allocation[type].remaining = `${newRemaining} units`;

      MOCK_ALLOCATION_DATA[sourceId].currentMonth = source;
    } else {
      // Regular allocation between different sites
      // Deduct from source
      const sourceAvailable = parseInt(source.allocation[type].available.split(' ')[0]) - units;
      source.allocation[type].available = `${sourceAvailable} units`;

      const sourceAllocated = parseInt(source.allocation[type].allocated.split(' ')[0]) + units;
      source.allocation[type].allocated = `${sourceAllocated} units`;

      // Add to target
      const targetAvailable = parseInt(target.allocation[type].available.split(' ')[0]) + units;
      target.allocation[type].available = `${targetAvailable} units`;

      MOCK_ALLOCATION_DATA[sourceId].currentMonth = source;
      MOCK_ALLOCATION_DATA[targetId].currentMonth = target;
    }

    // Calculate new totals
    const calculateTotal = (site) => {
      const peak = parseInt(site.allocation.peak.allocated.split(' ')[0]);
      const nonPeak = parseInt(site.allocation.nonPeak.allocated.split(' ')[0]);
      return `${peak + nonPeak} units`;
    };

    MOCK_ALLOCATION_DATA[sourceId].currentMonth.allocation.total = calculateTotal(source);
    if (sourceId !== targetId) {
      MOCK_ALLOCATION_DATA[targetId].currentMonth.allocation.total = calculateTotal(target);
    }

    return {
      success: true,
      message: sourceId === targetId ? 'Banking updated successfully' : 'Allocation completed successfully',
      data: {
        source: MOCK_ALLOCATION_DATA[sourceId].currentMonth,
        target: MOCK_ALLOCATION_DATA[targetId].currentMonth
      }
    };
  } catch (error) {
    console.error('Error in allocation:', error);
    throw error;
  }
};

// Get allocation status
export const getAllocationStatus = async (siteId) => {
  try {
    const siteData = MOCK_ALLOCATION_DATA[siteId];
    if (!siteData) {
      throw new Error('Site not found');
    }

    return {
      success: true,
      data: siteData.currentMonth
    };
  } catch (error) {
    console.error('Error getting allocation status:', error);
    throw error;
  }
};

export default productionApi;

// Define these functions once
const updateConsumptionData = async (siteId, month, year, data) => {
  try {
    if (!MOCK_CONSUMPTION_DATA[siteId]) {
      MOCK_CONSUMPTION_DATA[siteId] = [];
    }

    const index = MOCK_CONSUMPTION_DATA[siteId].findIndex(
      entry => entry.month === month && entry.year === year
    );

    if (index !== -1) {
      MOCK_CONSUMPTION_DATA[siteId][index] = {
        ...MOCK_CONSUMPTION_DATA[siteId][index],
        ...data
      };
    } else {
      MOCK_CONSUMPTION_DATA[siteId].push(data);
    }

    return {
      success: true,
      message: 'Consumption data updated successfully',
      data: MOCK_CONSUMPTION_DATA[siteId]
    };
  } catch (error) {
    console.error('Error updating consumption data:', error);
    throw error;
  }
};

const deleteConsumptionData = async (siteId, month, year) => {
  try {
    if (!MOCK_CONSUMPTION_DATA[siteId]) {
      throw new Error('Site not found');
    }

    MOCK_CONSUMPTION_DATA[siteId] = MOCK_CONSUMPTION_DATA[siteId].filter(
      entry => !(entry.month === month && entry.year === year)
    );

    return {
      success: true,
      message: 'Consumption data deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting consumption data:', error);
    throw error;
  }
};

// Update consumptionApi to use these functions
export const consumptionApi = {
  async getConsumptionData(siteId) {
    try {
      const data = siteId ? MOCK_CONSUMPTION_DATA[siteId] : Object.values(MOCK_CONSUMPTION_DATA).flat();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error fetching consumption data:', error);
      throw error;
    }
  },

  updateConsumptionData,
  deleteConsumptionData
};

const updateProductionData = async (siteId, month, year, data) => {
  try {
    if (!MOCK_HISTORICAL_DATA[siteId]) {
      MOCK_HISTORICAL_DATA[siteId] = [];
    }

    const index = MOCK_HISTORICAL_DATA[siteId].findIndex(
      entry => entry.month === month && entry.year === year
    );

    if (index !== -1) {
      // Update existing entry
      MOCK_HISTORICAL_DATA[siteId][index] = {
        ...MOCK_HISTORICAL_DATA[siteId][index],
        ...data
      };
    } else {
      // Add new entry
      MOCK_HISTORICAL_DATA[siteId].push(data);
    }

    return {
      success: true,
      message: 'Production data updated successfully',
      data: MOCK_HISTORICAL_DATA[siteId]
    };
  } catch (error) {
    console.error('Error updating production data:', error);
    throw error;
  }
};

const deleteProductionData = async (siteId, month, year) => {
  try {
    // Remove the entry from MOCK_HISTORICAL_DATA
    if (MOCK_HISTORICAL_DATA[siteId]) {
      MOCK_HISTORICAL_DATA[siteId] = MOCK_HISTORICAL_DATA[siteId].filter(
        entry => !(entry.month === month && entry.year === year)
      );
    }
    return {
      success: true,
      message: 'Production data deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting production data:', error);
    throw new Error('Failed to delete production data');
  }
};

export {
  productionApi,
  MOCK_PRODUCTION_SITES,
  MOCK_CONSUMPTION_DATA,
  MOCK_HISTORICAL_DATA,
  MOCK_SITE_DETAILS,
  ALLOCATION_RULES,
  formatProductionData,
  fetchSiteDetails,
  fetchSiteHistoricalData,
  updateProductionData,
  deleteProductionData,
  validateProductionData,
  updateConsumptionData,
  deleteConsumptionData
};
