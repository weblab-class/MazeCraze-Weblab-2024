import React, { useEffect, useState } from "react";
import "./Game.css";
import Maze from "../modules/Maze.js";
import Timer from "../modules/Timer.js";
import BetweenRound from "./BetweenRound.js";
import { socket } from "../../client-socket";
import { get } from "../../utilities.js";
import { useNavigate } from "react-router-dom";

const Game = ({ lobbyId, userId }) => {
  const [isBetweenRound, setIsBetweenRound] = useState(false);
  const [lobbyGameState, setLobbyGameState] = useState({ playerStats: {} });
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("EndRound", (data) => {
      setLobbyGameState(data.lobbyGameState); // TO DO, MAKE IT RECEIVE MULTIPLE PLAYER COINS
      console.log("This is the lobbyGame State inside the end round in Game.js", data.lobbyGameState.playerStats)
      setIsBetweenRound(true);
    });
    return () =>
      socket.off("EndRound", (data) => {
        setLobbyGameState(data.lobbyGameState); // TO DO, MAKE IT RECEIVE MULTIPLE PLAYER COINS
        setIsBetweenRound(true);
        setLobbyGameState(data.lobbyGameState)
      });
  }, []);

  useEffect (( )=> {

    return (() => {
     socket.emit("removeUserFromGame", {userId: userId, lobbyId: lobbyId})
    })
  }, [])
  

  useEffect(() => {
    get("/api/user_lobby", { lobby_id: lobbyId })
      .then((data) => {
        setLobbyGameState(data.lobbyGameState);
      })
      .catch((err) => console.log("Getting Lobby with Lobby Id In Game Given Has Error: ", err));
  }, []);
  return (
    <>
      {isBetweenRound ? (
        <BetweenRound lobbyGameState={lobbyGameState} />
      ) : (
        <div className="bg-primary-bg w-full h-full min-h-screen">
          
          <h1 className="font-bold text-center text-2xl text-primary-text h-[3%]">Perks</h1>
          {/* Eventually Make Perks an Individual Componenet */}
          <div className="PerkContainer h-[10%]">
            <div className="Perk" />
            <div className="Perk" />
            <div className="Perk" />
            <div className="Perk" />
            <div className="Perk" />
          </div>
          <div className="flex justify-center m-8 h-[80%]">
            <Maze lobbyId={lobbyId} userId={userId} />
          </div>
          <Timer className="h-[5%]"/>
        </div>
      )}
    </>
  );
};

export default Game;
