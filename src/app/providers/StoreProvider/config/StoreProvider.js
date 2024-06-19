import { configureStore } from "@reduxjs/toolkit";
import { personReducer } from "../personSlice";
import { categoriesReducer } from "../categoriesSlice";
import { networksReducer } from "../networkSlice";
import { adminReducer } from "../adminSlice";
import { regionReducer } from "../regionSlice";
import { emailReducer } from "../emailSlice";
import { partnerEmailReducer } from "../partnerSlice";

export default configureStore({
  reducer: {
    persons: personReducer,
    categories: categoriesReducer,
    networks: networksReducer,
    admin: adminReducer,
    regions: regionReducer,
    email: emailReducer,
    partnerEmail: partnerEmailReducer,
  },
});
