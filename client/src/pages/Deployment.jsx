import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendUrl } from "../utils/server";
import { toast } from "react-hot-toast";
import { userContex } from "../context/userContex";

const Deployment = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [deployment, setDeployment] = useState("");
  const [fetchlog, setFetchlog] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const { user } = useContext(userContex);

  const startDeplyment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/deployments/deploy-project`,
        {
          projectId: id,
          userId: user?.id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setDeployment(data.data);
      setFetchlog(true);
    } catch (error) {
      setLoading(false);
      setFetchlog(false);
      toast.error(error.response.data.message, {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    if (fetchlog === true) {
      const intervalId = setInterval(async () => {
        try {
          const { data } = await axios.get(
            `${backendUrl}/deployments/getlogs/${deployment?.deploymentId}`
          );
          setLogs((prevLogs) => [...data.logs]);
          if (logs.length >= 25) {
            clearInterval(intervalId);
            setFetchlog(false);
            setLoading(false);
            setDisabled(true);
          }
        } catch (error) {
          console.log(error);
        }
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [fetchlog, deployment?.deployment_id, logs.length]);
  console.log(logs);

  return (
    <>
      <div className="min-h-screen bg-gray-200">
        <button
          onClick={startDeplyment}
          disabled={disabled}
          className=" text-white w-44 py-2 px-4 bg-blue-500 rounded-lg ml-5 mt-10"
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
            <p>Start Deployment &rarr;</p>
          )}
        </button>
        <h1 className="text-2xl mt-8 ml-5 font-semibold">Deployment Logs:</h1>
        <div className="bg-gray-700 min-h-screen mt-2 text-white text-lg pb-5">
          <p className="pt-5 md:ml-5 ml-2">
            Deployment ID: {logs[0]?.deployment_id}
          </p>
          <p className="pt-5 md:ml-5 ml-2 pb-5">
            Event ID: {logs[0]?.event_id}
          </p>
          {logs.map((log) => (
            <p className="md:ml-5 ml-2 mt-5 pb-2 font-bold">
              Log: <span className="font-semibold">{log?.log}</span>
            </p>
          ))}
        </div>
        <div className="text-gray-700 text-xl mt-10 ml-5 pb-5">
          <p className="font-bold">
            URL:{" "}
            <a className="text-blue-500 font-semibold" target="_blank" href={deployment?.url}>
              {deployment?.url}
            </a>
          </p>
          <p className="mt-2 text-lg font-bold">Note: Wait untill build is complete</p>
        </div>
      </div>
    </>
  );
};

export default Deployment;
