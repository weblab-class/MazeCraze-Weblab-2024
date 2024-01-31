import React, { useEffect, useState } from "react";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { get, post } from "../../utilities.js";
import { perkMap, max_rounds } from "../modules/constants.js";
import Maze from "../../../dist/infoPictures/maze-gameplay.png";
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
    <div className="text-4xl font-custom tracking-widest text-primary-text font-bold bg-primary-bg w-full h-full min-h-screen px-4 overflow-hidden flex flex-col justify-start items-center relative ">
      <div className=" w-full h-24 flex justify-center items-center z-50 text-5xl">
        {isHovered ? (
          <IoArrowBackCircleOutline
            onMouseOut={handleMouseLeave}
            size={60}
            onClick={navigateBack}
            className="cursor-pointer absolute left-5 z-50"
          />
        ) : (
          <IoArrowBackCircle
            onMouseOver={handleMouseEnter}
            size={60}
            onClick={navigateBack}
            className="cursor-pointer absolute left-5 z-50"
          />
        )}
        Tutorial
      </div>
      <div className="bg-primary-block rounded-xl overflow-auto w-[88%] flex  p-8 ">
        <div className="bg-primary-bg rounded-xl min-h-screen h-full w-full z-50 flex flex-col text-primary-text text-2xl p-5 text-wrap  overflow-auto">
          <div className="flex flex-col self-center w-min whitespace-nowrap font-bold text-5xl mb-4">
            Welcome to Maze Craze!
            <div className="h-1.5 bg-white w-full rounded-full mt-2" />
          </div>
          <div className="mt-5 flex flex-col w-min whitespace-nowrap font-bold text-5xl mb-4">
            Objective
            <div className="h-1.5 bg-primary-text w-full rounded-full my-2" />
          </div>
          <section id="objective" className="text-3xl mb-12">
            <div className="flex flex-row w-full ">
              <div className="w-[50%] flex flex-col gap-10">
              <div>

              Obtain the most coins throughout the maze.
              </div>
              <div>
                Battle through the flurry of chaos in the maze and achieve victory against the other players!
              </div>
              </div>
              <div className="flex flex-col mt-5 w-[60%] items-center justify-center">
                <img
                  className="aspect-square rounded-full w-[90%] border-4 border-primary-text"
                  src={Maze}
                />
              </div>
            </div>
          </section>
          <div className="flex flex-col w-min whitespace-nowrap font-bold text-5xl mb-4">
            Information
            <div className="h-1.5 bg-primary-text w-full rounded-full mt-2" />
          </div>
          <section id="info" className="text-3xl flex flex-col gap-5 mb-12">
            <div>There are 5 rounds in a game</div>
            <div>After each round, a random perk is applied to the lobby, affecting game performance</div>
          </section>
          <div className="flex flex-col w-min whitespace-nowrap font-bold text-5xl mb-4">
            Controls
            <div className="h-1.5 bg-primary-text w-full rounded-full mt-2" />
          </div>

          <section id="controls" className="text-3xl mb-12 flex flex-col gap-5">
            <div>Use the WASD keys to navigate your player</div>
            <div>
              Customize your controls and view your lifetime stats inside the Customize Page
            </div>
          </section>
          <br />

          <div className="flex flex-col w-min whitespace-nowrap font-bold text-5xl mb-4">
            Perk Information
            <div className="h-1.5 bg-primary-text w-full rounded-full mt-2" />
          </div>
          <div id="perks" className="flex flex-col items-center justify-center gap-4">
            {/* {console.log(perkMap)} */}
            {perkMap.map((perk, index) => {
              return (
                <div key={index} className="flex justify-between items-center w-[80%] rounded-xl">
                  <div className="flex flex-col w-[80%] items-start justify-start py-4 px-4 rounded-xl bg-white  border-4 border-primary-text">
                    <div className="text-primary-block text-4xl"> {perk.name}</div>
                    <div className="text-2xl mt-4">{perk.description} </div>
                  </div>
                  <div className="flex justify-center items-center ml-10 w-[20%]">
                    <img
                      className="aspect-square rounded-full w-[70%] border-4 border-primary-text"
                      src={perk.src}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <br />
          <br />
          <div className="text-4xl">Have fun and enjoy the chaos!</div>
        </div>
      </div>
      <div className="bg-primary-block h-full w-20 flex absolute left-10"></div>
      <div className="bg-primary-block h-full w-20 flex absolute"></div>
      <div className="bg-primary-block h-full w-20 flex absolute right-10"></div>
      <div className="bg-primary-block h-24 w-full flex absolute "></div>
    </div>
  );
};

export default Tutorial;
