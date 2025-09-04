// src/redux/slices/api/teamApiSlice.js
import { apiSlice } from "../apiSlice";

const TEAMS_URL = "/teams";

export const teamApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query({
      query: () => ({
        url: TEAMS_URL,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Teams"],
    }),

    createTeam: builder.mutation({
      query: (data) => ({
        url: TEAMS_URL,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Teams"],
    }),

    updateTeam: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${TEAMS_URL}/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Teams"],
    }),

    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `${TEAMS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Teams"],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamApiSlice;
