import React, { useContext, useState } from "react";
import axios from "axios";
import { backendUrl } from "../utils/server";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { userContex } from "../context/userContex";

const Project = () => {
  const [githubUrl, setGitHubUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [subDomain, setSubDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectDetails, setProjectDetails] = useState("");
  const [deployButtont, setDeployButton] = useState(false);
  const { isAuthenticated, user } = useContext(userContex);
  const navigate = useNavigate();
  const createProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/projects/create-project`,
        {
          gitUrl: githubUrl,
          name: projectName,
          userId: user?.id,
          subDomain,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setProjectDetails(data.project);
      setLoading(false);
      setDeployButton(true);
      toast.success(data.message, {
        position: "top-center",
      });
    } catch (error) {
      console.log(error);

      setLoading(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };
  if (isAuthenticated === false) {
    navigate("/login");
  }

  return (
    <>
      <div className="flex h-screen bg-gray-200 flex-col">
        <div className="ml-5 md:ml-20 mt-10 mr-5 md:mr-20">
          <form onSubmit={createProject} className="mt-6">
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-600">
                Project Name
              </label>
              <input
                type="text"
                name="url"
                className="w-full px-4 py-2 border rounded focus:outline-none border-gray-500
                        focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setProjectName(e.target.value)}
                value={projectName}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-600">
                Github URL
              </label>
              <input
                type="text"
                name="url"
                className="w-full px-4 py-2 border rounded focus:outline-none border-gray-500
                        focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setGitHubUrl(e.target.value)}
                value={githubUrl}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-600">
                Project Sub Domain
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 border rounded focus:outline-none border-gray-500
                        focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSubDomain(e.target.value)}
                value={subDomain}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-8 text-white bg-blue-500 rounded
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
                <p>Create Project &rarr;</p>
              )}
            </button>
          </form>
        </div>
        {deployButtont === true ? (
          <div className="flex text-xl flex-col ml-5 md:ml-20 mt-10 gap-3">
            <p>Project ID: {projectDetails?.id}</p>
            <Link
              to={`deploy/${projectDetails?.id}`}
              className="py-2 px-3 w-48 bg-pink-500 text-white rounded-lg"
            >
              Deploy Project &rarr;
            </Link>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Project;
