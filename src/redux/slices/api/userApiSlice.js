import { apiSlice } from "../apiSlice";

const USERS_URL = "/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ===== USERS =====
    createUser: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to create user";
      },
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to update user profile";
      },
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to change password";
      },
    }),

    getTeamLists: builder.query({
      query: ({ search } = {}) => ({
        url: `${USERS_URL}/get-team?search=${search || ""}`,
        method: "GET",
        credentials: "include",
      }),
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to fetch team lists";
      },
    }),

    getUserTaskStatus: builder.query({
      query: () => ({
        url: `${USERS_URL}/get-status`,
        method: "GET",
        credentials: "include",
      }),
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to fetch user task status";
      },
    }),

    getNotifications: builder.query({
      query: () => ({
        url: `${USERS_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to fetch notifications";
      },
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to delete user";
      },
    }),

    userAction: builder.mutation({
      query: (data) => ({
        url: data.id ? `${USERS_URL}/${data.id}` : `${USERS_URL}/register`,
        method: data.id ? "PUT" : "POST",
        body: data,
        credentials: "include",
      }),
      transformErrorResponse: (response) => {
        return response.data?.message || "User action failed";
      },
    }),

    markNotiAsRead: builder.mutation({
      query: (data = {}) => ({
        url: `${USERS_URL}/read-noti?isReadType=${data.type || ""}&id=${data.id || ""}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to mark notification as read";
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
      transformErrorResponse: (response) => {
        return response.data?.message || "Logout failed";
      },
    }),

    // ===== TEAMS =====
    // Note: Team endpoints are handled by teamApiSlice.js
    // Use teamApiSlice hooks instead: useGetTeamsQuery, useCreateTeamMutation, etc.
  }),
});

export const {
  // Users
  useCreateUserMutation,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useGetTeamListsQuery,
  useGetUserTaskStatusQuery,
  useGetNotificationsQuery,
  useDeleteUserMutation,
  useUserActionMutation,
  useMarkNotiAsReadMutation,
  useLogoutMutation,
} = userApiSlice;
