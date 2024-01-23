import React from "react";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import { generateLobbyID, post } from "../../utilities";
import DashboardUI from "../../public/images/Dashboard.svg";

const GameName = "Maze Craze";
const Dashboard = ({ userId, handleLogout }) => {
  const navigate = useNavigate();
  const handleCreateLobby = () => {
    console.log("navigating to lobby BI");

    const lobby_id = generateLobbyID();
    console.log("navigating to lobby after generating ID");
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
      <GoogleOAuthProvider>
        <div className="relative text-5xl text-primary-text font-bold bg-primary-bg w-screen h-screen min-h-screen overflow-hidden">
          <div className="h-screen w-screen absolute z-0">
            <div className="absolute inset-y-[6.2%] inset-x-[5%] z-50 font-custom tracking-widest">
              {GameName}
            </div>

            <img src={DashboardUI} className=" h-full w-full absolute" />
          </div>

          <div className="flex flex-col w-full h-screen items-center justify-center z-50">
            <div className="gap-3 flex flex-col text-left font-custom tracking-widest">
              <Link to="/lobby/">
                <p className="pb-2">Find Game</p>
              </Link>
              <div onClick={handleCreateLobby} className="hover:cursor-pointer">
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
      </GoogleOAuthProvider>
    </>
  );
};

export default Dashboard;
