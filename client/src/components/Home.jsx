import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { userContex } from "../context/userContex";

const Home = () => {
   const {isAuthenticated} = useContext(userContex)
  return (
    <div className="bg-gray-200 min-h-screen pb-2">
      <div className="container mx-auto px-4 py-12 text-center pt-44">
        <h1 className="text-4xl md:text-5xl font-bold">
          Welcome To DeployEase
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Built for Developers, by Developers
        </p>
        <p className="mt-4 text-lg md:text-xl">
          Effortlessly manage your application, Deploy them, and keep track of
          all your application in one place.
        </p>

        <div className="mt-6">
          <Link
            to={isAuthenticated ? "/user-profile" : "/signup"}
            className="bg-white text-blue-500 px-6 py-3
                 rounded shadow-md font-semibold hover:bg-blue-100 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
