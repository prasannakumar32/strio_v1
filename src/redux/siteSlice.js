import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { siteApi } from '../api/siteApi';

export const fetchSites = createAsyncThunk(
  'sites/fetchSites',
  async (_, { rejectWithValue }) => {
    try {
      const sites = await siteApi.getAllSites();
      return sites;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSiteById = createAsyncThunk(
  'sites/fetchSiteById',
  async (siteId, { rejectWithValue }) => {
    try {
      const site = await siteApi.getSiteById(siteId);
      return site;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const siteSlice = createSlice({
  name: 'sites',
  initialState: {
    sites: [],
    selectedSite: null,
    loading: false,
    error: null
  },
  reducers: {
    setSelectedSite: (state, action) => {
      state.selectedSite = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.loading = false;
        state.sites = action.payload;
      })
      .addCase(fetchSites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSiteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSiteById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSite = action.payload;
      })
      .addCase(fetchSiteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedSite } = siteSlice.actions;
export default siteSlice.reducer; 