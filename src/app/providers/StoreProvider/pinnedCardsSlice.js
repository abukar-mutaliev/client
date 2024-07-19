// pinnedCardsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const pinnedCardsSlice = createSlice({
  name: "pinnedCards",
  initialState,
  reducers: {
    setPinnedCards(state, action) {
      return action.payload;
    },
    savePinnedCards(state, action) {
      // сохранение закрепленных карточек (можно сохранить в localStorage или на сервере)
      localStorage.setItem("pinnedCards", JSON.stringify(action.payload));
    },
  },
});

export const { setPinnedCards, savePinnedCards } = pinnedCardsSlice.actions;

export default pinnedCardsSlice.reducer;
