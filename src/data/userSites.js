// User site mapping data
export const userSites = [
  {
    userid: "testcase1",
    password: "strio@123",
    role: "user",
    email: "testcase1@strio.com",
    lastLogin: null,
    sites: ["salem", "namakkal"]
  },
  {
    userid: "testcase2",
    password: "strio@123",
    role: "user",
    email: "testcase2@strio.com",
    lastLogin: null,
    sites: ["erode", "trichy"]
  },
  {
    userid: "testcase3",
    password: "strio@123",
    role: "user",
    email: "testcase3@strio.com",
    lastLogin: null,
    sites: ["salem", "karur", "trichy", "nalippalayam"]
  },
  {
    userid: "testcase4",
    password: "strio@123",
    role: "user",
    email: "testcase4@strio.com",
    lastLogin: null,
    sites: ["coimbatore", "chennai", "salem", "madurai"]
  },
  {
    userid: "testcase5",
    password: "strio@123",
    role: "user",
    email: "testcase5@strio.com",
    lastLogin: null,
    sites: ["madurai", "ooty", "vellore", "cudallore"]
  }
];

// Get sites for a specific user
export const getUserSites = (userid) => {
  const user = userSites.find(user => user.userid === userid);
  return user ? user.sites : [];
};

// Verify user and get their sites
export const verifyUserAndGetSites = (userid, password) => {
  const user = userSites.find(user => 
    user.userid === userid && user.password === password
  );
  
  if (user) {
    return {
      authenticated: true,
      sites: user.sites,
      userData: {
        userid: user.userid,
        email: user.email,
        role: user.role
      }
    };
  }
  
  return {
    authenticated: false,
    sites: [],
    userData: null
  };
};

// Get all available sites
export const getAllSites = () => {
  const allSites = new Set();
  userSites.forEach(user => {
    user.sites.forEach(site => allSites.add(site));
  });
  return Array.from(allSites).sort();
};

// Check if user has access to a specific site
export const hasAccessToSite = (userid, site) => {
  const user = userSites.find(user => user.userid === userid);
  return user ? user.sites.includes(site.toLowerCase()) : false;
};
