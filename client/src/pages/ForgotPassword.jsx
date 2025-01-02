import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../utils/server.js";
import { toast } from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${backendUrl}/users/forgot-password`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message, {
        position: "top-center",
      });
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.log(error);

      toast.error(error.response.data.message, {
        position: "top-center",
      });
      setLoading(true);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-300">
      <div
        className="w-full max-w-md p-8  bg-white mt-[-100px] md:mt-[-70px]
    shadow-2xl shadow-gray-700 rounded-xl mr-5 ml-5"
      >
        <h1 className="text-2xl font-bold text-center text-gray-700">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded focus:outline-none border-gray-500
                      focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-bold text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded focus:outline-none border-gray-500
                      focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <Link className="text-green-500">Back To Login &rarr;</Link>
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded
             hover:bg-blue-600 focus:outline-none"
          >
            {loading ? (
              <div
                className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-gray-400 rounded-full"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only"></span>
              </div>
            ) : (
              <p>Change Password &rarr;</p>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;