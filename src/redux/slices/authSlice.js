import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  isSidebarOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { _id, id, name, fullName, username, email, role } = action.payload;

      // Normalize user object so UI always has consistent keys
      state.user = {
        id: _id || id || null,
        name: name || fullName || username || "Guest",
        email: email || "-",
        role: role || "user",
      };

      localStorage.setItem("userInfo", JSON.stringify(state.user));
    },

    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo");
    },

    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});

export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;

export default authSlice.reducer;
