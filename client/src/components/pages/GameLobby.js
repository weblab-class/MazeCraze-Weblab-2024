import React, { useEffect, useState, useRef } from "react";
import { get } from "../../utilities.js";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import { socket } from "../../client-socket.js";
import LobbyUserCard from "../modules/LobbyUserCard.js";
import  "./GameLobby.css";

const GameLobby = ({ lobbyId, userId }) => {
  const [lobby, setLobby] = useState({});
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const animeElement = useRef(null)

  const navigate = useNavigate();
  const navigateBack = () => {
    navigate(-1);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const launchGame = () => {
    navigate("game");
  };

  //Queries the API for the latest lobby using LobbyId
  useEffect(() => {
    get("/api/user_lobby", { lobby_id: lobbyId })
      .then((data) => {
        // console.log("Inside UseEffect for API Lobby ", data.user_array);
        setLobby(data.user_lobby);
        setLobbyUsers(data.user_array);
        if (data.user_lobby.host_id == userId) {
          setIsHost(true);
        }
      })
      .catch((err) => console.log("Getting Lobby with Lobby Id Given Has Error: ", err));
  }, [userId]);
  //Use Socket Listener to Check When New Player Joins
  useEffect(() => {
    const setNewLobby = (data) => {
      console.log("LOBBY USERS ON SOCKET ", lobbyUsers.length);
      setLobby(data.newLobby);
      setLobbyUsers(data.newUsers);
      console.log("NEW LOBBY DATA ON SOCKET ", data.newLobby);
      console.log("DATA LOBBY Joined USER ", data.joinedUser);
      console.log("NEW LOBBY USERS ON SOCKET ", lobbyUsers.length);
    };
    socket.on("lobby_join", setNewLobby);
    return () => {
      socket.off("lobby_join", setNewLobby);
    };
  }, [lobbyUsers]);

  const animate = () => {
    
  };
  const handleClick = () => {
    setIsAnimated(true)
    console.log("isAnimated", isAnimated)
    
    
    

  }
  useEffect(()=>{ setTimeout( () => {
    console.log("in Set Timeout!")
    console.log("isAnimate", isAnimated)
    if(isHost) {launchGame()} else {
      return 0
    }
  }, 1200)}, [isAnimated]);

  return (
   
    <div className="bg-primary-block min-h-screen h-full screen relative flex items-center justify-center text-primary-text font-custom tracking-widest">
      <div className="bg-primary-bg w-full h-[15%] absolute top-0 flex justify-center items-center text-6xl">
      {isHovered ? (
          <IoArrowBackCircleOutline
            onMouseOut={handleMouseLeave}
            size={60}
            onClick={navigateBack}
            className="absolute left-0 cursor-pointer"
          />
        ) : (
          <IoArrowBackCircle
            onMouseOver={handleMouseEnter}
            size={60}
            onClick={navigateBack}
            className="absolute left-0 cursor-pointer"
          />
        )}
        GameLobby
      </div>
      <div
        className="bg-primary-bg w-[30%] h-[60%] absolute bottom-0 flex items-center justify-center cursor-pointer text-2xl z-50"
        onClick={handleClick}
      >
        {isHost ? "START GAME" : "WAITING FOR HOST TO START GAME"}
      </div>
      <div className="bg-primary-block h-[50%] w-[35%] absolute left-0 p-3 overflow-y-auto text-3xl inset-y-[40%] z-40">
        <div className="border-b-4 border-primary-text">Player Box</div>
        {lobbyUsers.map((user, i) => (
          <LobbyUserCard data={user} key={i} />
        ))}
      </div>
      <div className="bg-primary-block h-[50%] w-[35%] absolute right-[0.1%] text-primary-pink p-3 text-3xl inset-y-[40%] z-40">
        <div className="border-b-4 border-primary-pink">Chat</div>
      </div>
      <div 
      className={`bg-primary-block w-[15%] h-[25%] absolute inset-y-[15%] inset-x-[35%]  z-50 ${isAnimated ? 'bg-primary-block w-[15%] h-[25%] absolute inset-y-[15%] inset-x-[35%] moveWallNegative z-50' : ''}`}
      ref = {animeElement}
      >

      </div>
      <div 
      className={`bg-primary-block w-[15%] h-[25%] absolute inset-y-[15%] inset-x-[50%] z-50 ${isAnimated ? 'bg-primary-block w-[15%] h-[25%] absolute inset-y-[15%] inset-x-[50%] moveWallPositive z-50' : ''}`}
      >

      </div>
      <div className="w-full h-[15%] bg-primary-bg absolute bottom-0 z-50 ">

      </div>
      <div
        className="bg-primary-bg w-[30%] h-[60%] absolute inset-y-[10%] flex items-center justify-center z-0"
      
      ></div>
    </div>
  );
};

export default GameLobby;
