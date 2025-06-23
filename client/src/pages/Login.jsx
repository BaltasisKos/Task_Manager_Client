import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate(); // 👈 Navigation hook

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ You can add real login validation here.
    // For now, we'll just redirect to the dashboard.
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="relative z-10 w-full md:w-auto flex flex-col md:flex-row items-center justify-center gap-0 md:gap-40">
        
        {/* Left: Marketing Content */}
        <div className="h-full w-full lg:w-3/5 flex flex-col items-center justify-center px-50">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-6xl font-black text-center dark:text-gray-400 text-blue-600">
              <span>Task Manager</span>
            </p>
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-blue text-blue-700">
              Manage all your tasks in one place!
            </span>
          </div>
        </div>

        {/* Right: Login/Signup Form */}
        <div className="w-[430px] bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex justify-center mb-4">
            <h2 className="text-3xl font-semibold text-center mb-10">
              {isLoginMode ? "Welcome Back!" : "Sign Up"}
            </h2>
          </div>

          {/* Toggle Buttons */}
          <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">
            <button
              className={`w-1/2 text-lg font-medium transition-all z-10 ${
                isLoginMode ? "text-white" : "text-black"
              }`}
              onClick={() => setIsLoginMode(true)}
            >
              Login
            </button>
            <button
              className={`w-1/2 text-lg font-medium transition-all z-10 ${
                !isLoginMode ? "text-white" : "text-black"
              }`}
              onClick={() => setIsLoginMode(false)}
            >
              Signup
            </button>
            <div
              className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 transition-all ${
                isLoginMode ? "left-0" : "left-1/2"
              }`}
            ></div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {!isLoginMode && (
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
            />

            {!isLoginMode && (
              <>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
                />
                <select
                  required
                  className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 text-gray-400"
                >
                  <option value="" disabled selected>
                    Select Role
                  </option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
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
              className="w-full p-3 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white rounded-full text-lg font-medium hover:opacity-90 transition"
            >
              {isLoginMode ? "Login" : "Signup"}
            </button>

            <p className="text-center text-gray-600">
              {isLoginMode
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoginMode(!isLoginMode);
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
