import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchRegions = createAsyncThunk(
  "regions/fetchRegions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/region");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addRegion = createAsyncThunk(
  "regions/addRegion",
  async (regionName, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/region/", {
        region_name: regionName,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRegion = createAsyncThunk(
  "regions/updateRegion",
  async ({ id, editingRegionName }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`api/region/${id}`, {
        region_name: editingRegionName,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRegion = createAsyncThunk(
  "regions/deleteRegion",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/region/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const regionSlice = createSlice({
  name: "regions",
  initialState: {
    regions: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.regions = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addRegion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRegion.fulfilled, (state, action) => {
        state.loading = false;
        state.regions.push(action.payload);
      })
      .addCase(addRegion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRegion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRegion.fulfilled, (state, action) => {
        const index = state.regions.findIndex(
          (region) => region.region_id === action.payload.region_id
        );

        if (index !== -1) {
          state.regions[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateRegion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRegion.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRegion.fulfilled, (state, action) => {
        state.regions = state.regions.filter(
          (region) => region.region_id !== action.payload
        );
        state.isLoading = false;
      })
      .addCase(deleteRegion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reducer: regionReducer } = regionSlice;
