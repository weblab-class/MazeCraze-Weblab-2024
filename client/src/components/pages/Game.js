import React, { useEffect, useState } from "react";
import "./Game.css";
import Maze from "../modules/Maze.js";
import Timer from "../modules/Timer.js";
import BetweenRound from "./BetweenRound.js";
import { socket } from "../../client-socket";
import { get } from "../../utilities.js";

const Game = ({ lobbyId, userId }) => {
  const [isBetweenRound, setIsBetweenRound] = useState(false);
  const [lobbyGameState, setLobbyGameState] = useState({ playerStats: {} });

  useEffect(() => {
    socket.on("EndRound", (lobbyGameState) => {
      setLobbyGameState(lobbyGameState); // TO DO, MAKE IT RECEIVE MULTIPLE PLAYER COINS
      setIsBetweenRound(true);
    });
    return () =>
      socket.off("EndRound", (lobbyGameState) => {
        setLobbyGameState(lobbyGameState); // TO DO, MAKE IT RECEIVE MULTIPLE PLAYER COINS
        setIsBetweenRound(true);
      });
  }, []);

  useEffect(() => {
    get("/api/user_lobby", { lobby_id: lobbyId })
      .then((data) => {
        setLobbyGameState(data.lobbyGameState);
      })
      .catch((err) => console.log("Getting Lobby with Lobby Id In Game Given Has Error: ", err));
  }, []);
  return (
    <BetweenRound lobbyGameState={lobbyGameState} />
    // <>
    //   <div className="bg-primary-bg w-full h-full min-h-screen">
    //     {isBetweenRound ? (
    //       <BetweenRound lobbyGameState={lobbyGameState} />
    //     ) : (
    //       <>
    //         <h1 className="font-bold text-center text-4xl text-primary-text">Perks</h1>
    //         {/* Eventually Make Perks an Individual Componenet */}
    //         <div className="PerkContainer">
    //           <div className="Perk" />
    //           <div className="Perk" />
    //           <div className="Perk" />
    //           <div className="Perk" />
    //           <div className="Perk" />
    //         </div>
    //         <div className="flex justify-center m-8 h-4/5">
    //           <Maze lobbyId={lobbyId} userId={userId} />
    //         </div>
    //         <Timer />
    //       </>
    //     )}
    //   </div>
    // </>
  );
};

export default Game;
