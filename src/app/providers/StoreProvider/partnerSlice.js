import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const sendPartnerEmail = createAsyncThunk(
  "partnerEmail/sendPartnerEmail",
  async (partnerEmailData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/send-partner-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partnerEmailData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Server responded with an error:", errorResponse);
        return rejectWithValue(errorResponse);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending email:", error);
      return rejectWithValue(error.message);
    }
  }
);

const partnerEmailSlice = createSlice({
  name: "partnerEmail",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendPartnerEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendPartnerEmail.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendPartnerEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { reducer: partnerEmailReducer } = partnerEmailSlice;
