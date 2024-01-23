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
    console.log("navigateBack");
    navigate(-1);
  };

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
        <div className="absolute inset-x-[46.2%] z-0 w-[10%] h-screen bg-primary-block"></div>

        <div className="relative inset-y-[13%] inset-x-[10%] bg-primary-pink h-screen w-4/5 p-4 flex rounded-md z-50">
          <div className="h-full w-full bg-white rounded-md"></div>
        </div>
      </div>
    </>
  );
};

export default SelectLobby;
