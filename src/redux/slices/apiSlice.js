import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = "http://localhost:5000/api";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include", // This ensures cookies are sent with requests
    // Note: We're using HTTP-only cookies for authentication, not Bearer tokens
    // The server will read the JWT from the cookie automatically
  }),
  tagTypes: ["User", "Task", "Teams"],
  endpoints: (builder) => ({}),
});
