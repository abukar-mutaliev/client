import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getNetworks = createAsyncThunk(
  "networks/getNetworks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/network");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getNetwork = createAsyncThunk(
  "network/getNetwork",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/network/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNetwork = createAsyncThunk(
  "networks/addNetwork",
  async (networkData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/network", networkData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNetwork = createAsyncThunk(
  "networks/deleteNetwork",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/network/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const networksSlice = createSlice({
  name: "networks",
  initialState: {
    networks: [],
    network: {},
    error: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getNetworks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNetworks.fulfilled, (state, action) => {
        state.networks = action.payload;
        state.isLoading = false;
      })
      .addCase(getNetworks.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(getNetwork.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNetwork.fulfilled, (state, action) => {
        state.network = action.payload;
        state.isLoading = false;
      })
      .addCase(getNetwork.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(addNetwork.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNetwork.fulfilled, (state, action) => {
        state.networks.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addNetwork.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(deleteNetwork.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteNetwork.fulfilled, (state, action) => {
        state.networks = state.networks.filter(
          (network) => network.network_id !== action.payload
        );
        state.isLoading = false;
      })
      .addCase(deleteNetwork.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { reducer: networksReducer } = networksSlice;
