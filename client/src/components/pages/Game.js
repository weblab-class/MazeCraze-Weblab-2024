import React, { useEffect, useState } from "react";
import "./Game.css";
import Maze from "../modules/Maze.js";
import Timer from "../modules/Timer.js";
import BetweenRound from "./BetweenRound.js";
import { socket } from "../../client-socket";
import { get } from "../../utilities.js";
import { useNavigate } from "react-router-dom";
import FinishedGame from "./FinishedGame.js";
import { round_time, max_rounds } from "../modules/constants.js";
import perkDict from "../modules/constants.js";
const Game = ({ lobbyId, userId }) => {
  const [isBetweenRound, setIsBetweenRound] = useState(false);
  const [lobbyGameState, setLobbyGameState] = useState({ playerStats: {} });
  const [gameFinished, setGameFinished] = useState(false);
  const [time, setTime] = useState(round_time);
  const [activatedPerks, setActivatedPerks] = useState([]);
  const navigate = useNavigate();

  const round_update = (data) => {
    console.log("ROUND DATA", data);
    setLobbyGameState(data.lobbyGameState);
    setActivatedPerks(data.lobbyGameState.activatedPerks);
    setIsBetweenRound(!data.lobbyGameState.in_round);
    setGameFinished(data.lobbyGameState.round > max_rounds);
  };
  useEffect(() => {
    socket.on("EndRound", round_update);
    return () => socket.off("EndRound", round_update);
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      socket.emit("removeUserFromGame", { userId: userId, lobbyId: lobbyId });
    });
    return () => {
      window.removeEventListener("beforeunload", (e) => {
        socket.emit("removeUserFromGame", { userId: userId, lobbyId: lobbyId });
      });
    };
  }, []);

  useEffect(() => {
    return () => {
      socket.emit("removeUserFromGame", { userId: userId, lobbyId: lobbyId });
    };
  }, []);

  useEffect(() => {
    socket.on("UpdateBetweenRoundTimer", (data) => {
      setTime(data.timeLeft);
    });
    return () =>
      socket.off("UpdateBetweenRoundTimer", (data) => {
        setTime(data.timeLeft);
      });
  }, []);

  useEffect(() => {
    get("/api/user_lobby", { lobby_id: lobbyId })
      .then((data) => {
        get("/api/user").then((data2) => {
          if (data.lobbyGameState) {
            setLobbyGameState(data.lobbyGameState);
            if (!Object.keys(data.lobbyGameState.playerStats).includes(data2.user._id)) {
              navigate("/");
            }
          } else {
            navigate("/");
          }
        });
      })
      .catch((err) => console.log("Getting Lobby with Lobby Id In Game Given Has Error: ", err));
  }, []);

  return (
    <div>
      {/* <BetweenRound lobbyGameState={lobbyGameState} /> */}
      {isBetweenRound || !isBetweenRound ? (
        <BetweenRound lobbyGameState={lobbyGameState} timer={time} />
      ) : gameFinished ? (
        <FinishedGame lobbyGameState={lobbyGameState} />
      ) : (
        <div className="bg-primary-bg w-full h-full min-h-screen">
          <h1 className="font-bold text-center text-2xl text-primary-text h-[3%]">Perks</h1>
          {/* Eventually Make Perks an Individual Componenet */}
          <div className="PerkContainer h-[10%]">
            {activatedPerks.map((perk, i) => {
              return (
                <img
                  className="Perk border-4 border-primary-text"
                  key={i}
                  src={perkDict[perk].src}
                />
              );
            })}
          </div>
          <div className="flex justify-center m-8 h-[80%]">
            <Maze lobbyId={lobbyId} userId={userId} />
          </div>
          <Timer className="h-[5%]" />
        </div>
      )}
    </div>
  );
};

export default Game;
