import React, { useEffect, useState } from "react";
import { get } from "../../utilities.js";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoArrowBackCircleOutline } from "react-icons/io5";

import { socket } from "../../client-socket.js";
import LobbyUserCard from "../modules/LobbyUserCard.js";

const GameLobby = ({ lobbyId, userId }) => {

  const [lobby, setLobby] = useState({});
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  useEffect(() => {
    socket.on("startGameForPlayers", (data) => {
      console.log("received from player", userId);
      navigate("game");
    });
    return () => {
      // socket.off("lobby_join", setNewLobby);
      socket.off("startGameForPlayers", (data) => {
        navigate("game");
      });
    };

  }, [])

  //Queries the API for the latest lobby using LobbyId
  useEffect(() => {
    get("/api/user_lobby", { lobby_id: lobbyId })
      .then((data) => {
        setLobby(data.lobbyGameState);
        setLobbyUsers(Object.values(data.lobbyGameState.playerStats));
        setIsHost(userId == data.lobbyGameState.host_id);
      })
      .catch((err) => console.log("Getting Lobby with Lobby Id Given Has Error: ", err));
      
    }, [userId]);
  
  //Use Socket Listener to Check When New Player Joins
  useEffect(() => {
    const setNewLobby = (lobbyGameState) => {
      setLobby(lobbyGameState);
      setLobbyUsers(Object.values(lobbyGameState.playerStats));
    };
    socket.on("lobby_join", (data) => {
      setNewLobby(data.gameState);
    });
    return () => {
      // socket.off("lobby_join", setNewLobby);
      socket.off("lobby_join", (data) => {
        setNewLobby(data.gameState);
      });
    };
  }, [lobbyUsers]);

  return (
    <div className="flex flex-col bg-primary-bg w-full h-full min-h-screen px-4 py-2 font-custom tracking-widest overflow-hidden">
      <div className="text-5xl text-primary-text font-bold mb-10 relative">
        {isHovered ? (
          <IoArrowBackCircleOutline
            onMouseOut={handleMouseLeave}
            size={60}
            onClick={navigateBack}
            className="absolute left-0"
          />
        ) : (
          <IoArrowBackCircle
            onMouseOver={handleMouseEnter}
            size={60}
            onClick={navigateBack}
            className="absolute left-0"
          />
        )}
        <div className=" h-full min-w-screen w-full flex justify-center text-center absolute inset-y-2">
          GameLobby
        </div>
      </div>
      <div className="flex gap-4 h-96 w-full mt-9">
        <div className="w-full bg-white p-3">
          Player Box
          {lobbyUsers.map((user, i) => (
            <LobbyUserCard data={user} key={i} />
          ))}
        </div>
        <div className="bg-blue-200 w-full">
          <div className="text-2xl text-primary-text font-bold mb-5 text-center pt-3">
            Welcome to Room {lobbyId}
          </div>
          <div className="flex flex-col px-10 text-wrap text-xl ">
            <span className="text-black font-bold">
              User Name:
              <span className="font-medium"> content</span>
            </span>
          </div>
        </div>
      </div>
      <div
        onClick={isHost ? () => {
          socket.emit("serverStartGameRequest", {lobbyId: lobbyId})} : () => 0}
        className="cursor-pointer flex justify-center items-center mt-5 p-5 text-bold text-primary-text bg-green-500"
      >
        {isHost ? "START GAME" : "WAITING FOR HOST TO START GAME"}
      </div>
    </div>
  );
};

export default GameLobby;
