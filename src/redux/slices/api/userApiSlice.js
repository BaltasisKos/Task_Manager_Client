import { apiSlice } from "../apiSlice";

const USERS_URL = "/users";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create new user (Admin only)
    createUser: builder.mutation({
      query: (data) => ({
        url: USERS_URL,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // Update user profile
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    // Get team list
    getTeamLists: builder.query({
      query: ({ search } = {}) => ({
        url: `${USERS_URL}/get-team?search=${search || ""}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // Get user task status
    getUserTaskStatus: builder.query({
      query: () => ({
        url: `${USERS_URL}/get-status`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // Get notifications
    getNotifications: builder.query({
      query: () => ({
        url: `${USERS_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // Delete a user
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    // Perform user action (activate/deactivate or register new)
    userAction: builder.mutation({
      query: (data) => ({
        url: data.id ? `${USERS_URL}/${data.id}` : `${USERS_URL}/register`,
        method: data.id ? "PUT" : "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // Mark notification as read
    markNotiAsRead: builder.mutation({
      query: (data = {}) => ({
        url: `${USERS_URL}/read-noti?isReadType=${data.type || ""}&id=${data.id || ""}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    // Change password
    changePassword: builder.mutation({
      query: (data = {}) => ({
        url: `${USERS_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    // Logout
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetTeamListsQuery,
  useGetUserTaskStatusQuery,
  useGetNotificationsQuery,
  useDeleteUserMutation,
  useUserActionMutation,
  useMarkNotiAsReadMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = userApiSlice;
