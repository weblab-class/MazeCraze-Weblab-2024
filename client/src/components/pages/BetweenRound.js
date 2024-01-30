import React, { useState, useEffect } from "react";
import LeaderboardCard from "../modules/LeaderboardCard";
import { between_round_time } from "../modules/constants";
import { socket } from "../../client-socket";
import CrumblingWall from "../../../dist/perkPictures/Crumbling_wall.png";
import Hermes from "../../../dist/perkPictures/Hermes_Boots.png";
import Hydra from "../../../dist/perkPictures/Hydra.png";
import MazeHaze from "../../../dist/perkPictures/Maze_Haze.png";
import ThreeBlindMice from "../../../dist/perkPictures/Three_Blind_Mice.png";
import WanderingCoins from "../../../dist/perkPictures/Wandering_Coins.png";
import SocialDistancing from "../../../dist/perkPictures/Social_Distancing.png";

const BetweenRound = ({ lobbyGameState, timer }) => {
  //FAKE DATA FOR TESTING
  // lobbyGameState = {
  //   host_id: "sdf",
  //   playerStats: {
  //     a: {
  //       name: "player a",
  //       totalCoins: 100,
  //       roundCoins: 10,
  //     },
  //     b: {
  //       name: "player b",
  //       totalCoins: 120,
  //       roundCoins: 10,
  //     },
  //     c: {
  //       name: "player c",
  //       totalCoins: 140,
  //       roundCoins: 10,
  //     },
  //     d: {
  //       name: "player d",
  //       totalCoins: 160,
  //       roundCoins: 10,
  //     },
  //     e: {
  //       name: "player e",
  //       totalCoins: 180,
  //       roundCoins: 10,
  //     },
  //   },
  //   totalPlayers: 1,
  //   round: 1,
  //   activatedPerks: [],
  //   timeLeft: 30,
  //   gridLayout: [],
  //   in_game: false,
  //   coinLocations: [],
  // };
  // const [time, setTime] = useState(between_round_time);
  // const updateTimer = (data) => {
  //   console.log("IN UPDATE TIMER", data);
  //   setTime(data.timeLeft);
  // };
  // useEffect(() => {
  //   socket.on("UpdateBetweenRoundTimer", (data) => {
  //     console.log("IN UPDATE TIMER", data);
  //     setTime(data.timeLeft);
  //   });
  //   console.log("SOCKET IS ON");
  //   return () =>
  //     socket.off("UpdateBetweenRoundTimer", (data) => {
  //       console.log("IN UPDATE TIMER", data);
  //       setTime(data.timeLeft);
  //     });
  // }, []);
  const comparePlayer = (player_one_id, player_two_id) => {
    const all_players = lobbyGameState.playerStats;
    const first_coins = all_players[player_one_id].totalCoins;
    const second_coins = all_players[player_two_id].totalCoins;
    return second_coins - first_coins;
  };
  return (
    <div className="font-custom tracking-widest flex bg-primary-bg bg-opacity-70 w-full h-full min-h-screen items-center justify-center">
      <div className="bg-primary-bg rounded-xl flex w-[90%] h-[80vh] items-center justify-center">
        <section
          id="left_side"
          className="relative flex flex-col items-center w-full h-full rounded-tl-lg rounded-bl-lg"
        >
          <div className="flex flex-col items-center  text-white text-center text-2xl xl:text-4xl mt-5 ">
            <div className="flex flex-col items-center">
              {"  Leaderboard  "}
              <div className="relative h-1.5 rounded-xl mt-3 bg-white w-full " />
            </div>
          </div>
          <div className="self-start flex flex-col items-center gap-5 overflow-auto bg-primary-block mt-6 pb-5 pt-8 px-10 w-full h-full rounded-tr-xl rounded-bl-xl">
            {Object.keys(lobbyGameState.playerStats)
              .sort(comparePlayer)
              .map((userId, i) => (
                <LeaderboardCard
                  key={i}
                  index={i}
                  playerData={lobbyGameState.playerStats[userId]}
                />
              ))}
          </div>
        </section>
        <section
          id="middle"
          className="px-8 bg-primary-bg flex flex-col justify-center h-full items-center "
        >
          <div className="h-[50%] mb-10 w-1.5 bg-white rounded-xl" />
        </section>
        <section
          id="right_side"
          className="bg-primary-bg flex flex-col items-center w-full h-full rounded-br-lg rounded-tr-xl"
        >
          <div className="text-white bg-primary-block w-full px-2 py-5 h-[75%] rounded-bl-xl rounded-tr-xl flex flex-col items-center justify-between ">
            <div className="flex flex-col items-center  w-full h-full">
              <div className="text-2xl xl:text-4xl text-center leading-normal">
                Starting <br /> New Round <br /> In
              </div>
              <div className="border-4 aspect-square border-primary-text h-[35%] rounded-xl mt-6 flex justify-center items-center">
                <div className="border-4 bg-primary-block border-primary-text rounded-xl aspect-square w-[80%] flex justify-center items-center text-lg lg:text-4xl xl:text-5xl font-bold">
                  {timer}
                </div>
              </div>
            </div>

            <div className="text-primary-text text-2xl xl:text-4xl mt-2 text-center ">
              Active Perks:
            </div>
          </div>
          <div className="relative h-1.5 rounded-xl mt-6 bg-white w-[50%] mb-2  " />
          <div className="flex flex-row items-center justify-center w-full h-[20%]">
            <div className="flex flex-col md:flex-row items-center justify-center w-min ">
              <div className="flex items-center justify-center gap-3 ">
                <div className="rounded-full bg-white aspect-square w-10 md:w-12 xl:w-16 "></div>
                <div className="rounded-full bg-white aspect-square w-10 md:w-12 xl:w-16 "></div>
                <div className="rounded-full bg-white aspect-square w-10 md:w-12 xl:w-16 "></div>
              </div>
              <div className="flex items-center justify-center ml-3 gap-3">
                <div className="rounded-full bg-white aspect-square w-10 md:w-12 xl:w-16 "></div>
                <div className="rounded-full bg-white aspect-square w-10 md:w-12 xl:w-16 "></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BetweenRound;
