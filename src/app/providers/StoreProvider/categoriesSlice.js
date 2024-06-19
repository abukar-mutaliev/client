import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (category_name, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/category", {
        category_name,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Ошибка при создании категории");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, editingCategoryName }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/category/${id}`, {
        category_name: editingCategoryName,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("Ошибка при обновлении категории");
    }
  }
);
export const getCategories = createAsyncThunk(
  "categories/getCategories",
  async (rejectWithValue) => {
    try {
      const response = await axios.get("/api/category");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCategory = createAsyncThunk(
  "category/getCategory",
  async (id) => {
    const response = await fetch(`/api/category/${id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Server Error!");
    }
    await response.json();
    return response.json();
  }
);
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/category/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    category: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isLoading = false;
      })
      .addCase(getCategories.rejected, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.category = action.payload;
      })
      .addCase(getCategory.rejected, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category.category_id !== action.payload
        );
        state.isLoading = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex(
          (cat) => cat.category_id === action.payload.category.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload.category;
        }
      })

      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addLesson, removeLesson, lessonEdit, addAudio } =
  categoriesSlice.actions;
export const { reducer: categoriesReducer } = categoriesSlice;
