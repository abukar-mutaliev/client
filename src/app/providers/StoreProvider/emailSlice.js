import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const sendEmail = createAsyncThunk(
  "email/sendEmail",
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
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

const emailSlice = createSlice({
  name: "email",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendEmail.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { reducer: emailReducer } = emailSlice;
