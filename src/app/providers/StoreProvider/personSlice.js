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

export const getPersons = createAsyncThunk(
  "persons/getPersons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/person");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPersonNetworks = createAsyncThunk(
  "persons/getPersonNetworks",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/person/${id}/networks`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPerson = createAsyncThunk(
  "person/getPerson",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/person/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPerson = createAsyncThunk(
  "persons/addPerson",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("/api/person", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deletePerson = createAsyncThunk(
  "persons/deletePerson",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/person/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePerson = createAsyncThunk(
  "persons/updatePerson",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axiosInstance.patch(`/person/${id}`, updatedData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const pinPerson = createAsyncThunk(
  "persons/pinPerson",
  async (personId, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/person/${personId}/pin`);
      return personId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const personsSlice = createSlice({
  name: "persons",
  initialState: {
    persons: [],
    person: {},
    personNetworks: [],
    networks: {},
    isLoading: false,
    error: null,
  },
  reducers: {
    clearPersons(state) {
      state.persons = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPersons.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPersons.fulfilled, (state, action) => {
        state.persons = action.payload;
        state.isLoading = false;
      })
      .addCase(getPersons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getPerson.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPerson.fulfilled, (state, action) => {
        state.person = action.payload;
        state.isLoading = false;
      })
      .addCase(getPerson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getPersonNetworks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPersonNetworks.fulfilled, (state, action) => {
        state.personNetworks = action.payload;
        state.isLoading = false;
      })
      .addCase(getPersonNetworks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addPerson.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addPerson.fulfilled, (state, action) => {
        state.persons.push(action.payload);
        state.isLoading = false;
      })
      .addCase(addPerson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updatePerson.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePerson.fulfilled, (state, action) => {
        const index = state.persons.findIndex(
          (person) => person.id === action.payload.id
        );
        if (index !== -1) {
          state.persons[index] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(updatePerson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(pinPerson.fulfilled, (state, action) => {
        const person = state.persons.find(
          (p) => p.person_id === action.payload
        );
        if (person) {
          person.pinned = !person.pinned;
        }
      });
  },
});

export const { clearPersons } = personsSlice.actions;
export const { reducer: personReducer } = personsSlice;
