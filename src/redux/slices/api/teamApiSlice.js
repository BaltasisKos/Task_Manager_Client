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
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to fetch teams";
      },
    }),

    // 🔹 Fetch archived teams only
    getArchivedTeams: builder.query({
      query: () => ({
        url: `${TEAMS_URL}/archived`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["ArchivedTeams"], // separate tag
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to fetch archived teams";
      },
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
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to create team";
      },
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
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to update team";
      },
    }),

    // Permanently delete a team
    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `${TEAMS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["ArchivedTeams", "Teams"], // invalidate archive list
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to delete team";
      },
    }),

    // Soft-delete (archive) a team
    softDeleteTeam: builder.mutation({
      query: (id) => ({
        url: `${TEAMS_URL}/${id}/archive`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["Teams", "ArchivedTeams"], // will affect active list
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to archive team";
      },
    }),

    // Restore an archived team
    restoreTeam: builder.mutation({
      query: (id) => ({
        url: `${TEAMS_URL}/${id}/restore`,
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: ["ArchivedTeams", "Teams"], // refresh both
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to restore team";
      },
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
