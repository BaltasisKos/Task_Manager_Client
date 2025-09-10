import { apiSlice } from "../apiSlice";

const TASKS_URL = "/tasks"; // make sure this matches your backend route

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE TASK
    createTask: builder.mutation({
      query: (data) => ({
        url: TASKS_URL,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Tasks", id: "LIST" }],
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to create task";
      },
    }),

    // READ ALL TASKS
    getAllTask: builder.query({
      query: () => ({
        url: TASKS_URL,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Tasks", id: _id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to fetch tasks";
      },
    }),

    // READ SINGLE TASK
    getSingleTask: builder.query({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Task", id }],
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to fetch task";
      },
    }),

    // UPDATE TASK
    updateTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/${data._id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { _id }) => [
        { type: "Task", id: _id },
        { type: "Task", id: "LIST" },
      ],
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to update task";
      },
    }),

    // SOFT DELETE (move to archive)
    softDeleteTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "PATCH",
        body: { status: "deleted" }, // moves task to archive
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to archive task";
      },
    }),

    // RESTORE TASK (from archive)
    restoreTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/${id}/restore`,  // matches backend route
        method: "PATCH",
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }], // refresh task list
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to restore task";
      },
    }),


    // PERMANENT DELETE
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
      transformErrorResponse: (response) => {
        return response.data?.message || "Failed to delete task";
      },
    }),

    // SEARCH ALL (tasks and users)
    searchAll: builder.query({
      query: (searchTerm) => ({
        url: `${TASKS_URL}/search?q=${encodeURIComponent(searchTerm)}`,
        method: "GET",
        credentials: "include",
      }),
      transformErrorResponse: (response) => {
        return response.data?.message || "Search failed";
      },
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetAllTaskQuery,
  useGetSingleTaskQuery,
  useUpdateTaskMutation,
  useSoftDeleteTaskMutation,
  useRestoreTaskMutation,
  useDeleteTaskMutation,
  useSearchAllQuery,
} = taskApiSlice;
