import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ConsumptionSiteSelector from '../components/ConsumptionSiteSelector';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/sites" element={<ConsumptionSiteSelector />} />
    </Routes>
  );
};

export default AppRoutes; 