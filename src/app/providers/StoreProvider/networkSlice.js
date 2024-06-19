import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getNetworks = createAsyncThunk(
  "networks/getNetworks",
  async (rejectWithValue) => {
    try {
      const response = await axios.get("/api/network");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getNetwork = createAsyncThunk("network/getNetwork", async (id) => {
  const response = await fetch(`/api/network/${id}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Server Error!");
  }
  await response.json();
  return response.json();
});

export const networksSlice = createSlice({
  name: "networks",
  initialState: {
    networks: [],
    network: [],
    error: null,
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
      .addCase(getNetworks.rejected, (state) => {
        state.isLoading = true;
      })
      .addCase(getNetwork.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNetwork.fulfilled, (state, action) => {
        state.isLoading = false;
        state.network = action.payload;
      })
      .addCase(getNetwork.rejected, (state) => {
        state.isLoading = true;
      });
  },
});

export const { addLesson, removeLesson, lessonEdit, addAudio } =
  networksSlice.actions;
export const { reducer: networksReducer } = networksSlice;
