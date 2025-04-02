import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Context } from "../Context/globalContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUserAuth } = useContext(Context);
  const navigate = useNavigate("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = { email: email, password: password };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/login`,
        data,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          validateStatus: (status) => status > 0,
        }
      );

      if (response.status === 200) {
        setUserAuth(true);
        navigate("/", { state: { name: "sibanarayan" } });
      }
    } catch (error) {
      console.log("Entering to the error section:");
      console.error("Error login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex mx-auto items-center w-11/12 h-screen justify-center bg-gradient-to-r from-gray-900 to-gray-700 container mx-auto max-w-screen-2xl w-screen">
        <div className="w-4/5 lg:w-1/3 min-[600px]:w-1/2  bg-gray-950 rounded-lg shadow-lg">
          <div className="p-6">
            <h1 className="text-center heading font-bold mb-6 text-white">
              Welcome Back
            </h1>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block nav-items font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 nav-items bg-gray-700 rounded-full text-white"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block nav-items font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300  shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 nav-items bg-gray-700 rounded-full text-white"
                  placeholder="Enter your password"
                />
              </div>
              <button
                type="submit"
                className={`w-full py-2 nav-items text-white bg-teal-900 rounded-full hover:bg-teal-700 transition duration-300 flex items-center justify-center ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3V4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                ) : (
                  "Login to Continue"
                )}
              </button>
            </form>
            <div className="flex flex-col items-center mt-4">
              <p className="mt-2 text-gray-700 nav-items">Or</p>
              <p className="mt-2 text-gray-700 nav-items">
                Don't have an account?{" "}
                <Link
                  className="text-teal-600 hover:underline nav-items underline-offset-4"
                  to="/sign-up"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
