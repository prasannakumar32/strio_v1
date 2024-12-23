import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Mock users data with their associated sites and roles
const MOCK_USERS = {
  strioadmin: {
    id: 'admin1',
    username: 'strioadmin',
    password: 'admin123',
    role: 'superuser',
    permissions: ['read', 'write', 'admin'],
    sites: [
      'PS1', 'PS2', 'PS3', 'PS4', 'PS5', 'PS6',  // Solar sites
      'PW1', 'PW2', 'PW3', 'PW4', 'PW5', 'PW6', 'PW7',  // Wind sites
      'WB1', 'WB2', 'WB3',  // Wind banking sites
      'CS1', 'CS2', 'CS3', 'CS4', 'CS5', 'CS6', 'CS7', 'CS8', 'CS9', 'CS10', 'CS11', 'CS12'  // Consumption sites
    ]
  },
  striouser: {
    id: 'manager1',
    username: 'striouser',
    password: 'user123',
    role: 'manager',
    permissions: ['read', 'write'],
    sites: [
      'PS1', 'PS2', 'PS3', 'PS4',  // First 4 solar sites
      'PW1', 'PW2', 'PW3', 'PW4',  // First 4 wind sites
      'WB1', 'WB2',  // First 2 wind banking sites
      'CS1', 'CS2', 'CS3', 'CS4', 'CS5', 'CS6'  // First 6 consumption sites
    ]
  },
  testcase1: {
    id: '1',
    username: 'testcase1',
    password: 'test123',
    role: 'user',
    permissions: ['read'],
    sites: [
      'PS1',         // One solar site
      'PW1',         // One wind site
      'CS1', 'CS2', 'CS3'  // Three consumption sites
    ]
  },
  testcase2: {
    id: '2',
    username: 'testcase2',
    password: 'test123',
    role: 'user',
    permissions: ['read'],
    sites: [
      'PS3', 'PS4',  // Next 2 solar sites
      'PW3', 'PW4',  // Next 2 wind sites
      'WB2',         // Second wind banking site
      'CS4', 'CS5'   // Next 2 consumption sites
    ]
  },
  testcase3: {
    id: '3',
    username: 'testcase3',
    password: 'test123',
    role: 'user',
    permissions: ['read'],
    sites: [
      'PS5',         // Fifth solar site
      'PW5',         // Fifth wind site
      'WB3',         // Third wind banking site
      'CS6', 'CS7'   // Next 2 consumption sites
    ]
  },
  testcase4: {
    id: '4',
    username: 'testcase4',
    password: 'test123',
    role: 'user',
    permissions: ['read'],
    sites: [
      'PS6',         // Last solar site
      'PW6',         // Sixth wind site
      'CS8', 'CS9'   // Next 2 consumption sites
    ]
  },
  testcase5: {
    id: '5',
    username: 'testcase5',
    password: 'test123',
    role: 'user',
    permissions: ['read'],
    sites: [
      'PW7',         // Last wind site
      'CS10', 'CS11', 'CS12'  // Last 3 consumption sites
    ]
  }
};

const mockData = {
  sites: [
    // Solar Production Sites
    {
      id: 'PS1',
      name: 'Pudukottai Solar Plant',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      location: 'Pudukottai, Tamil Nadu',
      capacity: '50 MW',
      status: 'Active',
      coordinates: { latitude: '10.3833° N', longitude: '78.8001° E' },
      metrics: { dailyGeneration: '200 MWh', monthlyGeneration: '6000 MWh', yearlyGeneration: '72000 MWh', efficiency: '85%' }
    },
    {
      id: 'PS2',
      name: 'Madurai Solar Farm',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      location: 'Madurai, Tamil Nadu',
      capacity: '45 MW',
      status: 'Active',
      coordinates: { latitude: '9.9252° N', longitude: '78.1198° E' },
      metrics: { dailyGeneration: '180 MWh', monthlyGeneration: '5400 MWh', yearlyGeneration: '64800 MWh', efficiency: '83%' }
    },
    {
      id: 'PS3',
      name: 'Trichy Solar Park',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      location: 'Trichy, Tamil Nadu',
      capacity: '55 MW',
      status: 'Active',
      coordinates: { latitude: '10.7905° N', longitude: '78.7047° E' },
      metrics: { dailyGeneration: '220 MWh', monthlyGeneration: '6600 MWh', yearlyGeneration: '79200 MWh', efficiency: '86%' }
    },
    {
      id: 'PS4',
      name: 'Salem Solar Complex',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      location: 'Salem, Tamil Nadu',
      capacity: '40 MW',
      status: 'Active',
      coordinates: { latitude: '11.6643° N', longitude: '78.1460° E' },
      metrics: { dailyGeneration: '160 MWh', monthlyGeneration: '4800 MWh', yearlyGeneration: '57600 MWh', efficiency: '82%' }
    },
    {
      id: 'PS5',
      name: 'Erode Solar Plant',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      location: 'Erode, Tamil Nadu',
      capacity: '48 MW',
      status: 'Active',
      coordinates: { latitude: '11.3410° N', longitude: '77.7172° E' },
      metrics: { dailyGeneration: '192 MWh', monthlyGeneration: '5760 MWh', yearlyGeneration: '69120 MWh', efficiency: '84%' }
    },
    {
      id: 'PS6',
      name: 'Coimbatore Solar Farm',
      type: 'SOLAR',
      siteType: 'PRODUCTION',
      location: 'Coimbatore, Tamil Nadu',
      capacity: '52 MW',
      status: 'Active',
      coordinates: { latitude: '11.0168° N', longitude: '76.9558° E' },
      metrics: { dailyGeneration: '208 MWh', monthlyGeneration: '6240 MWh', yearlyGeneration: '74880 MWh', efficiency: '85%' }
    },

    // Wind Production Sites
    {
      id: 'PW1',
      name: 'Tirunelveli Wind Farm',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Tirunelveli, Tamil Nadu',
      capacity: '75 MW',
      status: 'Active',
      coordinates: { latitude: '8.7139° N', longitude: '77.7567° E' },
      metrics: { dailyGeneration: '300 MWh', monthlyGeneration: '9000 MWh', yearlyGeneration: '108000 MWh', efficiency: '80%' }
    },
    {
      id: 'PW2',
      name: 'Thoothukudi Wind Park',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Thoothukudi, Tamil Nadu',
      capacity: '70 MW',
      status: 'Active',
      coordinates: { latitude: '8.7642° N', longitude: '78.1348° E' },
      metrics: { dailyGeneration: '280 MWh', monthlyGeneration: '8400 MWh', yearlyGeneration: '100800 MWh', efficiency: '79%' }
    },
    {
      id: 'PW3',
      name: 'Kanyakumari Wind Complex',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Kanyakumari, Tamil Nadu',
      capacity: '80 MW',
      status: 'Active',
      coordinates: { latitude: '8.0883° N', longitude: '77.5385° E' },
      metrics: { dailyGeneration: '320 MWh', monthlyGeneration: '9600 MWh', yearlyGeneration: '115200 MWh', efficiency: '82%' }
    },
    {
      id: 'PW4',
      name: 'Ramanathapuram Wind Farm',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Ramanathapuram, Tamil Nadu',
      capacity: '65 MW',
      status: 'Active',
      coordinates: { latitude: '9.3639° N', longitude: '78.8395° E' },
      metrics: { dailyGeneration: '260 MWh', monthlyGeneration: '7800 MWh', yearlyGeneration: '93600 MWh', efficiency: '78%' }
    },
    {
      id: 'PW5',
      name: 'Dindigul Wind Park',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Dindigul, Tamil Nadu',
      capacity: '72 MW',
      status: 'Active',
      coordinates: { latitude: '10.3624° N', longitude: '77.9695° E' },
      metrics: { dailyGeneration: '288 MWh', monthlyGeneration: '8640 MWh', yearlyGeneration: '103680 MWh', efficiency: '81%' }
    },
    {
      id: 'PW6',
      name: 'Theni Wind Complex',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Theni, Tamil Nadu',
      capacity: '68 MW',
      status: 'Active',
      coordinates: { latitude: '10.0104° N', longitude: '77.4768° E' },
      metrics: { dailyGeneration: '272 MWh', monthlyGeneration: '8160 MWh', yearlyGeneration: '97920 MWh', efficiency: '80%' }
    },
    {
      id: 'PW7',
      name: 'Tirupur Wind Farm',
      type: 'WIND',
      siteType: 'PRODUCTION',
      location: 'Tirupur, Tamil Nadu',
      capacity: '70 MW',
      status: 'Active',
      coordinates: { latitude: '11.1085° N', longitude: '77.3411° E' },
      metrics: { dailyGeneration: '280 MWh', monthlyGeneration: '8400 MWh', yearlyGeneration: '100800 MWh', efficiency: '80%' }
    },

    // Wind Banking Sites
    {
      id: 'WB1',
      name: 'Coimbatore Wind Banking',
      type: 'WIND_BANKING',
      siteType: 'PRODUCTION',
      location: 'Coimbatore, Tamil Nadu',
      capacity: '100 MW',
      status: 'Active',
      coordinates: { latitude: '11.0168° N', longitude: '76.9558° E' },
      metrics: { dailyGeneration: '400 MWh', monthlyGeneration: '12000 MWh', yearlyGeneration: '144000 MWh', efficiency: '83%' }
    },
    {
      id: 'WB2',
      name: 'Tirunelveli Wind Banking',
      type: 'WIND_BANKING',
      siteType: 'PRODUCTION',
      location: 'Tirunelveli, Tamil Nadu',
      capacity: '120 MW',
      status: 'Active',
      coordinates: { latitude: '8.7139° N', longitude: '77.7567° E' },
      metrics: { dailyGeneration: '480 MWh', monthlyGeneration: '14400 MWh', yearlyGeneration: '172800 MWh', efficiency: '84%' }
    },
    {
      id: 'WB3',
      name: 'Thoothukudi Wind Banking',
      type: 'WIND_BANKING',
      siteType: 'PRODUCTION',
      location: 'Thoothukudi, Tamil Nadu',
      capacity: '110 MW',
      status: 'Active',
      coordinates: { latitude: '8.7642° N', longitude: '78.1348° E' },
      metrics: { dailyGeneration: '440 MWh', monthlyGeneration: '13200 MWh', yearlyGeneration: '158400 MWh', efficiency: '82%' }
    },

    // Consumption Sites
    {
      id: 'CS1',
      name: 'Polyspin Exports Ltd Expansion Unit',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Rajapalayam, Tamil Nadu',
      status: 'Active',
      coordinates: { latitude: '9.4533° N', longitude: '77.5577° E' },
      metrics: { dailyConsumption: '100 MWh', monthlyConsumption: '3000 MWh', yearlyConsumption: '36000 MWh', peakDemand: '15 MW' }
    },
    {
      id: 'CS2',
      name: 'PEL Textiles',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Rajapalayam, Tamil Nadu',
      status: 'Active',
      coordinates: { latitude: '9.4533° N', longitude: '77.5577° E' },
      metrics: { dailyConsumption: '80 MWh', monthlyConsumption: '2400 MWh', yearlyConsumption: '28800 MWh', peakDemand: '12 MW' }
    },
    {
      id: 'CS3',
      name: 'M/s A. Ramar and Sons',
      type: 'INDUSTRIAL',
      siteType: 'CONSUMPTION',
      location: 'Rajapalayam, Tamil Nadu',
      status: 'Active',
      coordinates: { latitude: '9.4533° N', longitude: '77.5577° E' },
      metrics: { dailyConsumption: '90 MWh', monthlyConsumption: '2700 MWh', yearlyConsumption: '32400 MWh', peakDemand: '13 MW' }
    }
  ]
};

const apiService = {
  async login(username, password) {
    try {
      console.log('Login attempt with:', { username, password });
      
      // Check if user exists in mock data
      const trimmedUsername = username.trim().toLowerCase();
      const user = MOCK_USERS[trimmedUsername];
      console.log('Found user:', user);
      
      if (!user) {
        console.log('User not found');
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      if (user.password !== password.trim()) {
        console.log('Password mismatch');
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Create user data object with all necessary information
      const userData = {
        id: user.id,
        username: user.username,
        role: user.role,
        permissions: user.permissions,
        sites: user.sites
      };

      // Create a token
      const token = btoa(`${username}:${new Date().getTime()}`);
      
      // Store auth data in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('Login successful:', { userData });

      return {
        success: true,
        data: userData,
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed'
      };
    }
  },

  async validateToken() {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token || !storedUser) {
        return { success: false };
      }

      const user = JSON.parse(storedUser);
      return {
        success: true,
        user: user
      };
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: false };
    }
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  },

  async getDashboardData() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('User not authenticated');
      }

      const userSites = user.sites;
      const productionSites = userSites.filter(id => id.startsWith('P'));
      const consumptionSites = userSites.filter(id => id.startsWith('C'));

      return {
        success: true,
        data: {
          production: {
            total: productionSites.length * 100,
            windSites: productionSites.filter(id => id.startsWith('PW')).length,
            solarSites: productionSites.filter(id => id.startsWith('PS')).length
          },
          consumption: {
            total: consumptionSites.length * 50,
            activeConsumers: consumptionSites.length,
            available: productionSites.length * 100 - consumptionSites.length * 50
          },
          allocation: {
            total: Math.floor(consumptionSites.length * 50 * 0.8),
            recentAllocations: Math.min(2, consumptionSites.length),
            available: Math.floor(consumptionSites.length * 50 * 0.2)
          },
          reports: {
            total: userSites.length,
            performance: 'Available',
            efficiency: 'Updated'
          }
        }
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  async getSites(siteType = 'PRODUCTION') {
    try {
      // Get current user from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        throw new Error('User not authenticated');
      }

      // Filter sites based on user permissions and site type
      const filteredSites = mockData.sites.filter(site => {
        // Check if user has access to this site
        const hasAccess = userData.sites.includes(site.id);
        
        // Check if site type matches
        const isProductionSite = siteType === 'PRODUCTION' && 
          (site.id.startsWith('PS') || site.id.startsWith('PW') || site.id.startsWith('WB'));
        const isConsumptionSite = siteType === 'CONSUMPTION' && site.id.startsWith('CS');
        
        return hasAccess && (isProductionSite || isConsumptionSite);
      });

      return {
        success: true,
        data: filteredSites
      };
    } catch (error) {
      console.error('Error fetching sites:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  async getSiteDetails(siteId) {
    try {
      // Get current user from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        throw new Error('User not authenticated');
      }

      // Check if user has access to this site
      if (!userData.sites.includes(siteId)) {
        throw new Error('Access denied to this site');
      }

      const site = mockData.sites.find(site => site.id === siteId);
      if (!site) {
        throw new Error('Site not found');
      }

      return {
        success: true,
        data: site
      };
    } catch (error) {
      console.error('Error fetching site details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default apiService;
