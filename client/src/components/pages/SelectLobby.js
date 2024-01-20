import React, { useState } from "react";
import "./SelectLobby.css";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Navigate, useNavigate } from "react-router";

const SelectLobby = () => {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const navigate = useNavigate();
  const navigateBack = () => {
    console.log("navigateBack")
    navigate(-1)

  }

  return (
    <>
      <div className="flex flex-col text-center font-bold bg-primary-bg w-full h-full min-h-screen">
        <div className="flex justify-between px-5 items-center">
          <div className="">
            {isHovered ? (
              <IoArrowBackCircleOutline
                className="arrow-icon"
                onMouseOut={handleMouseLeave}
                size={60}
                onClick={navigateBack}
              />
            ) : (
              <IoArrowBackCircle className="arrow-icon" onMouseOver={handleMouseEnter} size={60} onClick={navigateBack}/>
            )}
          </div>
          <div className="text-primary-text py-8 text-5xl">Lobby Select</div>
          <div />
        </div>

        <div className="LobbyContainerOuter">
          <div className="LobbyContainerInner"></div>
        </div>
      </div>
    </>
  );
};

export default SelectLobby;
