import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import { generateLobbyID } from "../../utilities";
import DashboardUI from "../../public/images/Dashboard.svg";

const GameName = "Maze Craze";
const Dashboard = ({ userId, handleLogout }) => {
  const navigate = useNavigate();
  const handleCreateLobby = () => {
    const lobby_id = generateLobbyID();
    post("/api/newlobby", { lobby_id: lobby_id })
      .then((lobby) => {
        // console.log("navigating to new lobby: ", lobby);
        navigate(`/gamelobby/${lobby_id}`);
      })
      .catch((err) => {
        // console.log("Error Creating New Lobby:", err);
      });
  };

  useEffect(() => {
    post("/api/removeUserFromAllLobbies").then(()=>{}).catch((err)=> console.log("There was an error removing the user from all lobbies", err));
  }, []);

  return (
    <div>
      <GoogleOAuthProvider>
        <div className="bg-primary-bg flex items-center justify-center h-screen w-screen absolute flex-row overflow-hidden font-custom tracking-widest">
          <div className="h-full w-full relative overflow-hidden flex">
            <div className="bg-primary-block h-20 w-screen absolute inset-y-[86.5%]"></div>
            <div className="bg-primary-block select-none h-20 w-screen absolute inset-y-[1.9%] text-primary-text flex items-center text-5xl px-7 z-50">
              Maze Craze
            </div>
            <div className="bg-primary-block h-20 w-32 absolute inset-x-[47%] "></div>
            <div className="bg-primary-block h-32 w-32 absolute inset-x-[47%] inset-y-[90%]"></div>
            <div className="bg-primary-block h-[55%] w-28 absolute inset-x-[25%] inset-y-[8%]"></div>
            <div className="bg-primary-block h-[55%] w-28 absolute inset-x-[69%] inset-y-[37%]"></div>
            <div className="bg-primary-block h-[30%] w-[10%] absolute inset-x-[7%] inset-y-[35%]"></div>
            <div className="bg-primary-block h-[30%] w-[10%] absolute inset-x-[83.5%] inset-y-[35%]"></div>
            <div className="h-full w-full text-primary-text flex justify-center items-center md:text-2xl xl:text-5xl pt-4">
              <div className="flex flex-col gap-2 xl:gap-6">
                <Link to="/lobby/">
                  <p className="pb-3 w-min whitespace-nowrap">Find Game</p>
                </Link>
                <div>
                  <p
                    className="pb-3 hover:cursor-pointer w-min whitespace-nowrap"
                    onClick={handleCreateLobby}
                  >
                    Create Game
                  </p>
                </div>
                <Link to="/customize/">
                  <p className="pb-3 w-min whitespace-nowrap">Customize</p>
                </Link>
                <Link to="/tutorial/">
                  <p className="pb-3 w-min whitespace-nowrap">Tutorial</p>
                </Link>
                <div
                  onClick={() => {
                    googleLogout();
                    handleLogout();
                  }}
                  className="hover:cursor-pointer"
                >
                  <p className="pb-3 w-min whitespace-nowrap">Logout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default Dashboard;
