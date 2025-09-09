// src/redux/slices/api/teamApiSlice.js
import { apiSlice } from "../apiSlice";

const TEAMS_URL = "/teams";

export const teamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all teams
    getTeams: builder.query({
      query: () => ({
        url: TEAMS_URL,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Teams"],
    }),

    // 🔹 Fetch archived teams only
    getArchivedTeams: builder.query({
      query: () => ({
        url: `${TEAMS_URL}/archived`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["ArchivedTeams"], // separate tag
    }),

    // Create a new team
    createTeam: builder.mutation({
      query: (data) => ({
        url: TEAMS_URL,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Teams"],
    }),

    // Update a team
    updateTeam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${TEAMS_URL}/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Teams"],
    }),

    // Permanently delete a team
    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `${TEAMS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["ArchivedTeams", "Teams"], // invalidate archive list
    }),

    // Soft-delete (archive) a team
    softDeleteTeam: builder.mutation({
      query: (id) => ({
        url: `${TEAMS_URL}/${id}/archive`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["Teams", "ArchivedTeams"], // will affect active list
    }),

    // Restore an archived team
    restoreTeam: builder.mutation({
      query: (id) => ({
        url: `${TEAMS_URL}/${id}/restore`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["ArchivedTeams", "Teams"], // refresh both
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useGetArchivedTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useSoftDeleteTeamMutation,
  useRestoreTeamMutation,
} = teamApiSlice;
