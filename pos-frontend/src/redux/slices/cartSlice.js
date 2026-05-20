import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    // ================= ADD ITEMS =================
    addItems: (state, action) => {
      const newItem = action.payload;

      // ✅ CHECK SAME ITEM + SAME SPICE LEVEL
      const existingItem = state.find(
        (item) =>
          item.name === newItem.name &&
          item.spiceLevel === newItem.spiceLevel
      );

      // ✅ IF EXISTS => INCREASE QUANTITY
      if (existingItem) {
        existingItem.quantity += 1;

        // ✅ UPDATE TOTAL ITEM PRICE
        existingItem.price =
          existingItem.quantity *
          existingItem.pricePerQuantity;
      }

      // ✅ NEW ITEM
      else {
        state.push({
          ...newItem,

          quantity: 1,

          // ✅ SINGLE ITEM PRICE
          price: Number(newItem.pricePerQuantity),
        });
      }
    },

    // ================= REMOVE ITEM =================
    removeItem: (state, action) => {
      return state.filter(
        (item) => item.id !== action.payload
      );
    },

    // ================= CLEAR CART =================
    removeAllItems: () => {
      return [];
    },
  },
});

// ================= TOTAL PRICE =================
export const getTotalPrice = (state) =>
  state.cart.reduce(
    (total, item) => total + item.price,
    0
  );

export const {
  addItems,
  removeItem,
  removeAllItems,
} = cartSlice.actions;

export default cartSlice.reducer;