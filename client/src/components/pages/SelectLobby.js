import React, { useState, useEffect } from "react";
import "./SelectLobby.css";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";

import { Link, useNavigate } from "react-router-dom";
import SingleLobby from "../modules/SingleLobby";
import { get } from "../../utilities.js";

const SelectLobby = ({ userId }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [lobbyInfo, setLobbyInfo] = useState([]); //Contains Info Needed for Front-end (Number + Host)
  const [availableLobbies, setAvailableLobbies] = useState([]); //Contains DB Lobby Info
  const [refreshButton, setRefreshButton] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  //Gets Lobbies/Preloads into SelectLobby Screen On Mount
  useEffect(() => {
    get("/api/lobby").then((data) => {
      if (userId) {
        setAvailableLobbies(data);
      }
    });
  }, []);
  //Gets Lobbies/Preloads into SelectLobby Screen On Refresh
  useEffect(() => {
    get("/api/lobby").then((data) => {
      if (userId) {
        setAvailableLobbies(data);
      }
    });
  }, [refreshButton]);
  return (
    <>
      <div className="flex flex-col text-center font-bold bg-primary-bg w-full h-screen font-custom tracking-widest">
        <div id="header" className="h-[15%] flex justify-between px-5 items-center ">
          <div className="cursor-pointer bg-primary-bg text-primary-text">
            {isHovered ? (
              <IoArrowBackCircleOutline
                onMouseOut={handleMouseLeave}
                size={60}
                onClick={navigateBack}
              />
            ) : (
              <IoArrowBackCircle onMouseOver={handleMouseEnter} size={60} onClick={navigateBack} />
            )}
          </div>
          <div className="text-primary-text text-5xl">Lobby Select</div>
          <div />
        </div>

        <section id="body" className="h-[85%] flex flex-col items-center justify-center my-4">
          <div className=" bg-primary-pink h-full w-4/5 rounded-xl p-4">
            <div className="flex flex-col bg-white px-4 py-1 rounded-xl min-h-full">
              <div
                onClick={() => setRefreshButton(!refreshButton)}
                className="flex items-center justify-between  text-primary-block text-xl px-2 py-2"
              >
                <div className="flex items-center">
                  Search
                  <textarea
                    id="chat"
                    rows="1"
                    class="block mx-4 py-2 px-3 w-1/2 text-sm text-gray-900 overflow-hidden bg-white rounded-lg border border-gray-300 focus:ring-primary-block focus:border-primary-block"
                    placeholder="ENTER LOBBY CODE"
                  ></textarea>
                </div>
                <div className="flex cursor-pointer">
                  Refresh
                  <HiOutlineRefresh className="ml-1" size={25} />
                </div>
              </div>
              <hr className=" bg-gray-200 h-0.5" />
              {availableLobbies && availableLobbies.length != 0 ? (
                availableLobbies.map((lobby, i) => <SingleLobby lobby={lobby} key={i} />)
              ) : (
                <div className="bg-black text-5xl text-primary-text flex flex-col items-center justify-center w-full h-full">
                  No Lobbies Open
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SelectLobby;
