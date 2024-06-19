import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export const registerAdmin = createAsyncThunk(
  "admin/registerAdmin",
  async (adminData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/admin/registration", adminData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Неизвестная ошибка" });
    }
  }
);

export const fetchAdmins = createAsyncThunk("admins/fetchAdmins", async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("/api/admin/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
});

export const loginAdmin = createAsyncThunk(
  "admin/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/admin/login", {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      const decodedToken = jwtDecode(token);
      return { token, admin: decodedToken };
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Ошибка авторизации");
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  "admins/deleteAdmin",
  async (adminId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Не авторизован");
      }
      const decodedToken = jwtDecode(token);

      const response = await axios.delete(`/api/admin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { token: decodedToken, isAdmin: response.data.isAdmin };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const checkAdminStatus = createAsyncThunk(
  "admin/checkAdminStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Не авторизован");
      }
      const decodedToken = jwtDecode(token);
      const response = await axios.get("/api/admin/auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { admin: decodedToken, isAdmin: response.data.isAdmin };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admins: [],
    admin: null,
    token: localStorage.getItem("token") || null,
    status: "idle",
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logoutAdmin: (state) => {
      localStorage.removeItem("token");
      state.status = "idle";
      state.admin = null;
      state.error = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.admins.push(action.payload);
      })
      .addCase(registerAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        localStorage.setItem("token", action.payload.token);
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAdmin = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(checkAdminStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAdminStatus.fulfilled, (state, action) => {
        state.admin = action.payload.admin;
        state.isAuthenticated = true;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(checkAdminStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteAdmin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.admins = state.admins.filter(
          (admin) => admin.user_id !== action.payload.user_id
        );
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logoutAdmin } = adminSlice.actions;
export const { reducer: adminReducer } = adminSlice;
