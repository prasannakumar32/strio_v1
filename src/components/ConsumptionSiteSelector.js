import React, { useEffect } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSites, setSelectedSite } from '../redux/siteSlice';
import { useNavigate } from 'react-router-dom';

const ConsumptionSiteSelector = () => {
  const dispatch = useDispatch();
  const { sites } = useSelector((state) => state.sites);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchSites());
  }, [dispatch]);

  const handleSiteSelection = (selected) => {
    dispatch(setSelectedSite(selected));
    const numericId = selected.id.replace('C', '');
    navigate(`/consumption/view/${numericId}`);
  };

  return (
    <div className="consumption-site-selector">
      <Select 
        options={sites}
        onChange={handleSiteSelection}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.id}
        placeholder="Select a consumption site..."
        className="site-selector"
      />
    </div>
  );
};

export default ConsumptionSiteSelector; 