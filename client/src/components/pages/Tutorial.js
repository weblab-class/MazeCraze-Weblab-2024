import React, {useEffect, useState} from "react";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../utilities.js";


const Tutorial = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate("/");
  };

  useEffect(()=>{
    get("/api/user").then(()=>{}).catch(()=>{navigate("/")})
  },[])

  return (
    <div className="text-4xl font-custom tracking-widest text-primary-text font-bold bg-primary-bg w-full h-full min-h-screen px-4 overflow-hidden flex justify-center items-center relative ">
      <div className="cursor-pointer w-full h-24 absolute top-0 flex justify-center  items-center z-50 text-7xl">
        {isHovered ? (
          <IoArrowBackCircleOutline
            onMouseOut={handleMouseLeave}
            size={60}
            onClick={navigateBack}
            className="absolute left-0 z-50"
          />
        ) : (
          <IoArrowBackCircle
          onMouseOver={handleMouseEnter}
          size={60}
          onClick={navigateBack}
          className="absolute left-0 z-50"
          />
        )}
        Tutorial
      </div>
      <div className="bg-primary-block h-[60%] w-[88%] flex absolute p-8">
        <div className="bg-primary-pink h-full w-full z-50 flex justify-center items-center text-primary-bg text-xl p-5 text-wrap text-center">
          Welcome to Maze Craze. 
          <br /> To play the game is simple. 
          <br /> Use the keys specified in Customize page to navigate your character. 
          <br /> The goal of the game is to win the game through collecting coins.  
          <br />Coins are worth points each.
          <br />After every round a perk will be picked at random that will an effect on the gameplay. That perk will be displayed at the top
          <br />The perks include HERMES BOOTS, SOCIAL DISTANCING, 
          <br /> Have fun and enjoy the chaos!
        </div>
      </div>
      <div className="bg-primary-block h-full w-20 flex absolute left-10"></div>
      <div className="bg-primary-block h-full w-20 flex absolute"></div>
      <div className="bg-primary-block h-full w-20 flex absolute right-10"></div>
      <div className="bg-primary-block h-20 w-full flex absolute "></div>
    </div>
  );
};

export default Tutorial;
