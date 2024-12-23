// Production Resource Data API
export const productionResourceData = [
  {
    "userid": "resource001",
    "password": "strio@123",
    "role": "production",
    "email": "resource001@strio.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": null,
    "resourceData": {
      "month_year": "2024-01",
      "r1": 2500,    // Electricity (kWh)
      "r2": 1800,    // Natural Gas (cubic meters)
      "r3": 3500,    // Water (liters)
      "r4": 160,     // Labor Hours (hrs)
      "r5": 2000     // Raw Materials (kg)
    }
  },
  {
    "userid": "resource002",
    "password": "strio@123",
    "role": "production",
    "email": "resource002@strio.com",
    "createdAt": "2024-01-02T00:00:00.000Z",
    "lastLogin": null,
    "resourceData": {
      "month_year": "2024-01",
      "r1": 2800,
      "r2": 1950,
      "r3": 3800,
      "r4": 175,
      "r5": 2200
    }
  },
  {
    "userid": "resource003",
    "password": "strio@123",
    "role": "production",
    "email": "resource003@strio.com",
    "createdAt": "2024-01-03T00:00:00.000Z",
    "lastLogin": null,
    "resourceData": {
      "month_year": "2024-01",
      "r1": 2600,
      "r2": 1850,
      "r3": 3600,
      "r4": 165,
      "r5": 2100
    }
  },
  {
    "userid": "resource004",
    "password": "strio@123",
    "role": "production",
    "email": "resource004@strio.com",
    "createdAt": "2024-01-04T00:00:00.000Z",
    "lastLogin": null,
    "resourceData": {
      "month_year": "2024-01",
      "r1": 2900,
      "r2": 2000,
      "r3": 3900,
      "r4": 180,
      "r5": 2300
    }
  },
  {
    "userid": "resource005",
    "password": "strio@123",
    "role": "production",
    "email": "resource005@strio.com",
    "createdAt": "2024-01-05T00:00:00.000Z",
    "lastLogin": null,
    "resourceData": {
      "month_year": "2024-01",
      "r1": 2700,
      "r2": 1900,
      "r3": 3700,
      "r4": 170,
      "r5": 2150
    }
  },
  {
    "userid": "resource006",
    "password": "strio@123",
    "role": "production",
    "email": "resource006@strio.com",
    "createdAt": "2024-01-06T00:00:00.000Z",
    "lastLogin": null,
    "resourceData": {
      "month_year": "2024-01",
      "r1": 3000,
      "r2": 2100,
      "r3": 4000,
      "r4": 185,
      "r5": 2400
    }
  },
  {
    "userid": "resource007",
    "password": "strio@123",
    "role": "production",
    "email": "resource007@strio.com",
    "createdAt": "2024-01-07T00:00:00.000Z",
    "lastLogin": null,
    "resourceData": {
      "month_year": "2024-01",
      "r1": 2750,
      "r2": 1920,
      "r3": 3750,
      "r4": 172,
      "r5": 2180
    }
  },
  {
    "userid": "resource008",
    "password": "strio@123",
    "role": "production",
    "email": "resource008@strio.com",
    "createdAt": "2024-01-08T00:00:00.000Z",
    "lastLogin": null,
    "resourceData": {
      "month_year": "2024-01",
      "r1": 2850,
      "r2": 1980,
      "r3": 3850,
      "r4": 178,
      "r5": 2250
    }
  },
  {
    "userid": "resource009",
    "password": "strio@123",
    "role": "production",
    "email": "resource009@strio.com",
    "createdAt": "2024-01-09T00:00:00.000Z",
    "lastLogin": null,
    "resourceData": {
      "month_year": "2024-01",
      "r1": 2950,
      "r2": 2050,
      "r3": 3950,
      "r4": 182,
      "r5": 2350
    }
  },
  {
    "userid": "resource010",
    "password": "strio@123",
    "role": "production",
    "email": "resource010@strio.com",
    "createdAt": "2024-01-10T00:00:00.000Z",
    "lastLogin": null,
    "resourceData": {
      "month_year": "2024-01",
      "r1": 3100,
      "r2": 2150,
      "r3": 4100,
      "r4": 190,
      "r5": 2500
    }
  }
];

// Resource Types and Units
export const resourceTypes = {
  r1: { name: "Electricity", unit: "kWh" },
  r2: { name: "Natural Gas", unit: "cubic meters" },
  r3: { name: "Water", unit: "liters" },
  r4: { name: "Labor Hours", unit: "hrs" },
  r5: { name: "Raw Materials", unit: "kg" }
};

// Example usage with the API:
/*
import { createResource } from '../services/consumptionApi';
import { productionResourceData } from './resourceData';

// Function to add resource data
const addResourceData = async () => {
  try {
    for (const data of productionResourceData) {
      await createResource(data);
    }
    console.log('Resource data added successfully');
  } catch (error) {
    console.error('Error adding resource data:', error);
  }
};
*/