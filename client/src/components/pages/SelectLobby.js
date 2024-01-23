import React, { useState, useEffect } from "react";
import "./SelectLobby.css";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Navigate, useNavigate } from "react-router";
import { get } from "../../utilities";
import SingleLobby from "../modules/SingleLobby";

const SelectLobby = ({ userId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [availableLobbies, setAvailableLobbies] = useState([]); //Contains DB Lobby Info
  const [lobbyInfo, setLobbyInfo] = useState([]); //Contains Info Needed for Front-end (Number + Host)
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const navigate = useNavigate();
  const navigateBack = () => {
    console.log("navigateBack");
    navigate(-1);
  };

  useEffect(() => {
    get("/api/lobby").then((data) => {
      if (userId) {
        setAvailableLobbies(data);
      }
    });
  }, []);
  return (
    <>
      <div className="relative flex flex-col text-center font-bold bg-primary-bg w-full h-full min-h-screen font-custom tracking-widest">
        <div id="header" className="flex justify-between px-5 items-center z-40">
          <div className="">
            {isHovered ? (
              <IoArrowBackCircleOutline
                className="arrow-icon"
                onMouseOut={handleMouseLeave}
                size={60}
                onClick={navigateBack}
              />
            ) : (
              <IoArrowBackCircle
                className="arrow-icon"
                onMouseOver={handleMouseEnter}
                size={60}
                onClick={navigateBack}
              />
            )}
          </div>
          <div className="text-primary-text py-8 text-5xl">Lobby Select</div>
          <div />
        </div>

        <div className="LobbyContainerOuter">
          <div className="flex flex-col bg-white">
            {availableLobbies.map((lobby, i) => (
              <SingleLobby lobby={lobby} key={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectLobby;
