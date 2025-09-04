import { apiSlice } from "../apiSlice";

const USERS_URL = "/users";
const TEAMS_URL = "/teams";

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
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    getTeamLists: builder.query({
      query: ({ search } = {}) => ({
        url: `${USERS_URL}/get-team?search=${search || ""}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getUserTaskStatus: builder.query({
      query: () => ({
        url: `${USERS_URL}/get-status`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getNotifications: builder.query({
      query: () => ({
        url: `${USERS_URL}/notifications`,
        method: "GET",
        credentials: "include",
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),

    userAction: builder.mutation({
      query: (data) => ({
        url: data.id ? `${USERS_URL}/${data.id}` : `${USERS_URL}/register`,
        method: data.id ? "PUT" : "POST",
        body: data,
        credentials: "include",
      }),
    }),

    markNotiAsRead: builder.mutation({
      query: (data = {}) => ({
        url: `${USERS_URL}/read-noti?isReadType=${data.type || ""}&id=${data.id || ""}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    changePassword: builder.mutation({
      query: (data = {}) => ({
        url: `${USERS_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),

    // ===== TEAMS =====
    getTeams: builder.query({
      query: () => ({
        url: TEAMS_URL,
        method: "GET",
        credentials: "include",
      }),
    }),

    createTeam: builder.mutation({
      query: (data) => ({
        url: TEAMS_URL,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    updateTeam: builder.mutation({
      query: (data) => ({
        url: `${TEAMS_URL}/${data.id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `${TEAMS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  // users
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

  // teams
  useGetTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = userApiSlice;
