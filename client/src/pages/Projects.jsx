import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { userContex } from "../context/userContex";
import axios from "axios";
import { toast } from "react-hot-toast";
import { backendUrl } from "../utils/server";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useContext(userContex);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/projects/user-projects/${user?.id}`
        );
        console.log(data);
        setProjects(data.projects);
        toast.success(data.message, {
          position: "top-center",
        });
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message, {
          position: "top-center",
        });
      }
    };
    fetchUserProjects();
  }, []);
  console.log(projects);
  return (
    <>
      <div className="bg-gray-200 min-h-screen text-gray-700">
        <div className="flex flex-col justify-start pl-5 pt-10 gap-2">
          <p className="font-bold">
            Name: {"  "} <span className="font-semibold">{user?.name}</span>
          </p>
          <p className="font-bold">
            Email: {"  "} <span className="font-semibold">{user?.email}</span>
          </p>
          <h3 className="text-pink-500 font-bold mt-2"> Your Projects: </h3>
          {projects.map((project) => (
            <div className="flex flex-col gap-2 ml-2">
              <p className="font-bold">
                Project Name: {"  "}{" "}
                <span className="font-semibold">{project?.name}</span>
              </p>
              <p className="font-bold">
                Sub Domain: {"  "}{" "}
                <span className="font-semibold">{project?.subDomain}</span>
              </p>
              <p className="font-bold">
                Project Id: {"  "}{" "}
                <span className="font-semibold">{project?.id}</span>
              </p>
              <p className="font-bold">
                Github Url: {"  "}{" "}
                <span className="font-semibold text-blue-500">
                  <a href={project?.gitUrl}>{project?.gitUrl}</a>
                </span>
              </p>
              <p className="font-bold">
                Project Url: {"  "}{" "}
                <span className="text-blue-500 font-semibold">
                  <a href={"http://" + project?.name + ".localhost:8000"}>
                    {"http://" + project?.name + ".localhost:8000"}
                  </a>
                </span>
              </p>
              <div className="w-full py-1 bg-cyan-600 mt-2 mb-2"></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
