import React, { useEffect, useState } from "react";
import "./Game.css";
import Maze from "../modules/Maze.js";
import Timer from "../modules/Timer.js";
import BetweenRound from "./BetweenRound.js";
import { socket } from "../../client-socket";
import { get } from "../../utilities.js";
import { useNavigate} from "react-router-dom";
import FinishedGame from "./FinishedGame.js";
import { round_time, max_rounds } from "../modules/constants.js";
import CrumblingWall from "../../../dist/perkPictures/Crumbling_wall.png";
import Hermes from "../../../dist/perkPictures/Hermes_Boots.png";
import Hydra from "../../../dist/perkPictures/Hydra.png";
import MazeHaze from "../../../dist/perkPictures/Maze_Haze.png";
import ThreeBlindMice from "../../../dist/perkPictures/Three_Blind_Mice.png";
import WanderingCoins from "../../../dist/perkPictures/Wandering_Coins.png";
import SocialDistancing from "../../../dist/perkPictures/Social_Distancing.png";

const Game = ({ lobbyId, userId }) => {
  const [isBetweenRound, setIsBetweenRound] = useState(false);
  const [lobbyGameState, setLobbyGameState] = useState({ playerStats: {} });
  const [gameFinished, setGameFinished] = useState(false);
  const [time, setTime] = useState(round_time);
  const [activatedPerks, setActivatedPerks] = useState([])
  const navigate = useNavigate()

  const round_update = (data) => {
    console.log("ROUND DATA", data);
    setLobbyGameState(data.lobbyGameState);
    setActivatedPerks(data.lobbyGameState.activatedPerks)
    setIsBetweenRound(!data.lobbyGameState.in_round);
    setGameFinished(data.lobbyGameState.round > max_rounds);
  };
  useEffect(() => {
    socket.on("EndRound", round_update);
    return () => socket.off("EndRound", round_update);
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
    console.log("SOCKET IS ON");
    return () =>
      socket.off("UpdateBetweenRoundTimer", (data) => {
        setTime(data.timeLeft);
      });
  }, []);

  useEffect(() => {
    return () => {
      socket.emit("removeUserFromGame", { userId: userId, lobbyId: lobbyId });
    };
  }, []);

  useEffect(() => {
    get("/api/user_lobby", { lobby_id: lobbyId })
      .then((data) => {
        get("/api/user").then((data2) => {

          setLobbyGameState(data.lobbyGameState);
          if(!Object.keys(data.lobbyGameState.playerStats).includes(data2.user._id)) {
            navigate("/")
          }
        })
      })
      .catch((err) => console.log("Getting Lobby with Lobby Id In Game Given Has Error: ", err));
  }, []);

  return (
    <div>
      {/* <BetweenRound lobbyGameState={lobbyGameState} /> */}
      {isBetweenRound ? (
        <BetweenRound lobbyGameState={lobbyGameState} timer={time} />
      ) : (gameFinished) ? (
        <FinishedGame lobbyGameState={lobbyGameState} />
      ) : (
        <div className="bg-primary-bg w-full h-full min-h-screen">
          <h1 className="font-bold text-center text-2xl text-primary-text h-[3%]">Perks</h1>
          {/* Eventually Make Perks an Individual Componenet */}
          <div className="PerkContainer h-[10%]">
            {activatedPerks.map((perk) =>{
              if (perk === "Crumbling Walls"){
                return <img className="Perk" src={CrumblingWall}/>
              } else if (perk === "Hermes Boots") {
                return <img className="Perk" src={Hermes}/>
              } else if (perk === "Hydra Coins") {
                return <img className="Perk" src={Hydra}/>
              } else if (perk === "Maze Haze") {
                return <img className="Perk" src={MazeHaze}/>
              } else if (perk === "Social Distancing") {
                return <img className="Perk" src={SocialDistancing}/>
              } else if (perk === "Three Blind Mice") {
                return <img className="Perk" src={ThreeBlindMice}/>
              } else if (perk === "Wandering Coins") {
                return <img className="Perk" src={WanderingCoins}/>
              }
            })}
            {/* <img className="Perk" src={}/>
            <img className="Perk" />
            <img className="Perk" />
            <img className="Perk" />
            <img className="Perk" /> */}
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
