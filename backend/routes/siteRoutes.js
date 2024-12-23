// Example of expected API endpoints and response structure

// GET /api/sites
// Response:
{
  "sites": [
    {
      "id": "site1",
      "name": "Site A",
      "location": "Location A",
      "capacity": 100,
      "status": "active"
    },
    {
      "id": "site2",
      "name": "Site B",
      "location": "Location B",
      "capacity": 150,
      "status": "inactive"
    }
  ]
}

// GET /api/sites/:siteId
// Response:
{
  "id": "site1",
  "name": "Site A",
  "location": "Location A",
  "capacity": 100,
  "status": "active",
  "details": {
    "address": "Full address here",
    "coordinates": {
      "lat": 123.456,
      "lng": 789.012
    },
    "contactPerson": "John Doe",
    "contactEmail": "john@example.com"
  }
} 