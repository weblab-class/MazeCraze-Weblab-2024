import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    get("/api/user")
      .then(() => {})
      .catch(() => {
        navigate("/");
      });
  }, []);

  return (
    <div className="text-4xl font-custom tracking-widest text-primary-text font-bold bg-primary-bg w-full h-full min-h-screen px-4 overflow-hidden flex justify-center items-center relative ">
      <div className="cursor-pointer w-full h-24 absolute top-0 flex justify-center  items-center z-50 text-7xl">
        {isHovered ? (
          <IoArrowBackCircleOutline
            onMouseOut={handleMouseLeave}
            size={60}
            onClick={navigateBack}
            className="absolute left-5 z-50"
          />
        ) : (
          <IoArrowBackCircle
            onMouseOver={handleMouseEnter}
            size={60}
            onClick={navigateBack}
            className="absolute left-5 z-50"
          />
        )}
        Tutorial
      </div>
      <div className="bg-primary-block h-[70%] w-[88%] flex absolute p-8">
        <div className="bg-primary-pink h-full w-full z-50 flex  items-center flex-col text-primary-bg text-xl p-5 text-wrap text-center overflow-auto">
          <div className="text-3xl">Welcome to Maze Craze!</div>
          <br />
          <br /> To play the game is simple.
          <br /> Use the keys specified in Customize page to navigate your character.
          <br /> The goal of the game is to win through collecting coins.
          <br />
          After every round a perk will be picked at random that will have an effect on the
          gameplay. That perk will be displayed at the top.
          <br />
          <br />
          The perks include CRUMBLING WALL, HERMES BOOTS, HYDRA COINS, MAZE HAZE, SOCIAL DISTANCING,
          THREE BLIND MICE, AND WANDERING COINS
          <br />
          <br />
          <div className="">
            <br />
            <div className=" text-xl text-primary-block">Crumbling Walls </div>
            perk will remove one wall every second.
            <br />
            <br />
            <div className=" text-xl text-primary-block">Hydra Coins </div>
            perk has a chance to spawn an additional coin after the user collects a coin.
            <br />
            <br />
            <div className=" text-xl text-primary-block">Hermes Boots</div>
            perk will increase movement speed.
            <br />
            <br />
            <div className="text-xl text-primary-block">Maze Haze</div>
            perk will limit field of view
            <br />
            <br />
            <div className="text-xl text-primary-block">Social Distancing</div>
            perk will cause players to die when they crash into each other
            <br />
            <br />
            <div className="text-xl text-primary-block">Three Blind Mice</div>
            perk spawn three mice that will chase players down and try to kill them
            <br />
            <br />
            <div className="text-xl text-primary-block">Wandering Coins</div>
            perk will make Coins move around the map
          </div>
          <br />
          <br />
          <div className="text-4xl">Have fun and enjoy the chaos!</div>
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
