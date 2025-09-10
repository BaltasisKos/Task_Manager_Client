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
      const { _id, id, name, fullName, username, email, role, title, isAdmin } = action.payload;

      // Normalize user object so UI always has consistent keys
      state.user = {
        id: _id || id || null,
        name: name || fullName || username || "Guest",
        email: email || "-",
        role: role || "user",
        title: title || "",
        isAdmin: isAdmin || false,
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

    updateUserProfile: (state, action) => {
      if (state.user) {
        // Update only the provided fields, keep existing values for others
        state.user = {
          ...state.user,
          ...action.payload,
        };
        localStorage.setItem("userInfo", JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, setOpenSidebar, updateUserProfile } = authSlice.actions;

export default authSlice.reducer;
