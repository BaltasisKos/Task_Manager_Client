import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "http://localhost:5000/api";

export const apiSlice = createApi({
  reducerPath: "api", // required
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include", // include cookies for auth
  }),
  tagTypes: ["User", "Task", "Teams"], // optional, useful for cache invalidation
  endpoints: (builder) => ({}),
});
