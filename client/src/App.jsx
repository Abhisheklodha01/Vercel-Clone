import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Project from "./pages/Project";
import Deployment from "./pages/Deployment";
import { userContex } from "./context/userContex";
import { useContext, useEffect } from "react";
import { backendUrl } from "./utils/server";
import axios from "axios";
import UserProfile from "./pages/UserProfile";
import Projects from "./pages/Projects";

function App() {
  const { isAuthenticated, setUser, setIsAuthenticated } =
    useContext(userContex);
  const token = localStorage.getItem("DeployEase-Auth_Token");
  useEffect(() => {
    axios
      .get(`${backendUrl}/users/user-profile`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data.user);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        setUser({});
        setIsAuthenticated(false);
      });
  }, [isAuthenticated]);
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user-profile" element={<UserProfile />} />
      </Routes>
      <Routes>
        <Route path="/project" element={<Project />} />
        <Route path="/project/deploy/:id" element={<Deployment />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
