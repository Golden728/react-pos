import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  phone: "",
  role: "",
  isAuth: false,
  authChecked: false, // ✅ IMPORTANT
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, name, phone, email, role } = action.payload;

      state._id = _id;
      state.name = name;
      state.phone = phone;
      state.email = email;
      state.role = role;
      state.isAuth = true;
      state.authChecked = true; // ✅ IMPORTANT
    },

    removeUser: (state) => {
      state._id = "";
      state.name = "";
      state.phone = "";
      state.email = "";
      state.role = "";
      state.isAuth = false;
      state.authChecked = true; // ✅ IMPORTANT
    },

    setAuthChecked: (state) => {
      state.authChecked = true;
    },
  },
});

export const { setUser, removeUser, setAuthChecked } = userSlice.actions;
export default userSlice.reducer;