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
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    // READ ALL TASKS
    getAllTask: builder.query({
      query: () => ({
        url: TASKS_URL,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Task", id: _id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    // READ SINGLE TASK
    getSingleTask: builder.query({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Task", id }],
    }),

    // UPDATE TASK
    updateTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { _id }) => [
        { type: "Task", id: _id },
        { type: "Task", id: "LIST" },
      ],
    }),

    // SOFT DELETE (move to archive)
    softDeleteTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "PATCH",
        body: { status: "deleted" }, // moves task to archive
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),

    // RESTORE TASK (from archive)
    restoreTask: builder.mutation({
  query: (id) => ({
    url: `/tasks/${id}/restore`,  // matches backend route
    method: "PATCH",
  }),
  invalidatesTags: [{ type: "Task", id: "LIST" }], // refresh task list
}),


    // PERMANENT DELETE
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
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
  useDeleteTaskMutation, // now fully exists
} = taskApiSlice;
