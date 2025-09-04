import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { setCredentials } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";


// Validation schemas for login and signup
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const signupSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: yup.string().required("Please select a role"),
});

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // <-- ADD THIS

  const isLoginMode = location.pathname === "/log-in";
  const schema = isLoginMode ? loginSchema : signupSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const API_URL = "http://localhost:5000/api/users/";

    try {
      let response;
      let result;

      if (isLoginMode) {
        response = await fetch(`${API_URL}login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Login failed");
        }

        result = await response.json();
        console.log("Login successful:", result);
        dispatch(setCredentials(result)); // <-- dispatch now works
        navigate("/dashboard");
      } else {
        const { confirmPassword, ...userData } = data;
        response = await fetch(`${API_URL}register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Signup failed");
        }

        result = await response.json();
        console.log("Signup successful:", result);
        dispatch(setCredentials(result));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message || "Something went wrong");
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="relative z-10 w-full md:w-auto flex flex-col md:flex-row items-center justify-center gap-0 md:gap-40">

        {/* Left Side */}
        <div className="h-full w-full lg:w-3/5 flex flex-col items-center justify-center px-50">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <p className="py-3 flex flex-col gap-0 md:gap-4 text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-400 bg-clip-text text-transparent cursor-default">
              <span>Task Manager</span>
            </p>
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-blue text-blue-500 cursor-default">
              Manage all your tasks in one place!
            </span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-[430px] bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex justify-center mb-2">
            <h2 className="text-3xl font-semibold text-center mb-8 cursor-default">
              {isLoginMode ? "Welcome Back!" : "Sign Up"}
            </h2>
          </div>

          {/* Toggle Buttons */}
          <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">
            <button
              className={`w-1/2 text-lg font-medium transition-all z-10 cursor-pointer ${
                isLoginMode ? "text-white" : "text-black"
              }`}
              onClick={() => navigate("/log-in")}
              type="button"
            >
              Login
            </button>
            <button
              className={`w-1/2 text-lg font-medium transition-all z-10 cursor-pointer ${
                !isLoginMode ? "text-white" : "text-black"
              }`}
              onClick={() => navigate("/register")}
              type="button"
            >
              Signup
            </button>
            <div
              className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-blue-600 via-cyan-600 to-cyan-300 transition-all ${
                isLoginMode ? "left-0" : "left-1/2"
              }`}
            ></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
            {!isLoginMode && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  {...register("name")}
                  className={`w-full p-3 border-b-2 outline-none placeholder-gray-700 ${
                    errors.name ? "border-red-500" : "border-gray-300 focus:border-cyan-500"
                  }`}
                />
                <p className="text-red-500 text-sm">{errors.name?.message}</p>
              </>
            )}

            <input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className={`w-full p-3 border-b-2 outline-none placeholder-gray-700 ${
                errors.email ? "border-red-500" : "border-gray-300 focus:border-cyan-500"
              }`}
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>

            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`w-full p-3 border-b-2 outline-none placeholder-gray-700 ${
                errors.password ? "border-red-500" : "border-gray-300 focus:border-cyan-500"
              }`}
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>

            {!isLoginMode && (
              <>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  className={`w-full p-3 border-b-2 outline-none placeholder-gray-700 ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300 focus:border-cyan-500"
                  }`}
                />
                <p className="text-red-500 text-sm">{errors.confirmPassword?.message}</p>

                <select
                  {...register("role")}
                  className={`w-full p-3 border-b-2 outline-none text-gray-700${
                    errors.role ? "border-red-500" : "border-gray-300 focus:border-cyan-500"
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                <p className="text-red-500 text-sm">{errors.role?.message}</p>
              </>
            )}

            {isLoginMode && (
              <div className="text-right">
                <a href="#" className="text-cyan-600 hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full p-3 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white rounded-full text-lg font-medium hover:opacity-90 transition cursor-pointer disabled:opacity-50"
            >
              {isLoginMode ? "Login" : "Signup"}
            </button>

            <p className="text-center text-gray-600 cursor-default">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(isLoginMode ? "/register" : "/log-in");
                }}
                className="text-cyan-600 hover:underline"
              >
                {isLoginMode ? "Signup now" : "Login"}
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
