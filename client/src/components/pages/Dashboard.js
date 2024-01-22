import React from "react";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import { generateLobbyID, post } from "../../utilities";

const Dashboard = ({ userId, handleLogout }) => {
  const navigate = useNavigate();
  const handleCreateLobby = () => {
    const lobby_id = generateLobbyID();
    post("/api/newlobby", { lobby_id: lobby_id })
      .then((dfg) => {
        console.log("navigating to lobby");
        navigate(`/gamelobby/${lobby_id}`);
      })
      .catch((err) => {
        console.log("Error Creating New Lobby:", err);
      });
  };
  return (
    <>
      <div className="text-5xl text-primary-text font-bold bg-primary-bg w-full h-full min-h-screen px-4 py-2">
        <div className="absolute top-2 left-4">Maze Craze</div>
        <div className="flex flex-col w-full h-screen items-center justify-center">
          <div className="gap-1 flex flex-col text-left">
            <Link to="/lobby/">
              <p className="pb-2">Find Game</p>
            </Link>
            <div onClick={handleCreateLobby} className="cursor-pointer">
              <p className="pb-2">Create Game</p>
            </div>
            <Link to="/customize/">
              <p className="pb-2">Customize</p>
            </Link>
            <Link to="/tutorial/">
              <p className="pb-2">Tutorial</p>
            </Link>
            <div
              onClick={() => {
                googleLogout();
                handleLogout();
              }}
              className="hover:cursor-pointer"
            >
              <p className="pb-2">Logout</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
