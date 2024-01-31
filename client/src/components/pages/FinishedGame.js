import React, { useState, useEffect } from "react";
import { socket } from "../../client-socket";
import { Link } from "react-router-dom";
import LeaderboardCard from "../modules/LeaderboardCard";
import { post } from "../../utilities";
const FinishedGame = ({ lobbyGameState }) => {
  //Posting GameStats to DB
  useEffect(() => {
    const user_ids = Object.keys(lobbyGameState.playerStats);
    if (user_ids.length > 0) {
      let [maxCoins, id] = [lobbyGameState.playerStats[user_ids[0]].totalCoins, user_ids[0]];
      for (const user_id of user_ids) {
        const player_coins = lobbyGameState.playerStats[user_id].totalCoins;
        if (player_coins > maxCoins) {
          [maxCoins, id] = [player_coins, user_id];
        }
      }
      post("/api/update_user_stats", {
        winner_id: id,
        playerStats: lobbyGameState.playerStats,
      }).then(() => {
        console.log("Incremented Game Statistics");
      });
    }
  }, []);

  const comparePlayer = (player_one_id, player_two_id) => {
    const all_players = lobbyGameState.playerStats;
    const first_coins = all_players[player_one_id].totalCoins;
    const second_coins = all_players[player_two_id].totalCoins;
    return second_coins - first_coins;
  };

  return (
    <div className="relative overflow-hidden flex flex-col font-custom tracking-widest bg-primary-bg w-full h-full min-h-screen items-center justify-center">
      <div className="z-50 mt-5 overflow-auto px-10 py-10 rounded-xl bg-primary-block text-2xl text-primary-text flex flex-col gap-5 w-[50%] h-[65vh]">
        {Object.keys(lobbyGameState.playerStats)
          .sort(comparePlayer)
          .map((userId, i) => (
            <LeaderboardCard key={i} index={i} playerData={lobbyGameState.playerStats[userId]} />
          ))}
      </div>
      <Link
        to="/"
        className="absolute z-50 bottom-6 text-2xl lg:text-4xl text-center text-primary-text"
      >
        BACK TO MAIN MENU
      </Link>
      <div className="absolute  inset-x-[10%] top-0 bg-primary-block h-[64%] w-24" />
      <div className="absolute  inset-x-[33%] top-0 bg-primary-block h-[100%] w-24" />
      <div className="absolute  inset-x-[77%] bottom-0 bg-primary-block h-[35%] w-24" />
      <div className="absolute  inset-x-[83%] top-0 bg-primary-block h-[69%] w-24" />
      <div className="absolute  inset-x-[95%] top-0 bg-primary-block h-[26%] w-24" />
      <div className="absolute  inset-x-[83%] inset-y-[25%] bg-primary-block h-24 w-[100%]" />
      <div className="absolute  inset-x-[33%] top-0 bg-primary-block h-24 w-[52%] flex items-center ">
        <div className="relative left-10 text-3xl lg:text-5xl text-primary-text ">LEADERBOARD </div>
      </div>
      <div className="absolute  aspect-square inset-x-[10%] inset-y-[80%] bg-primary-block w-24" />
      <div className="absolute  left-0 inset-y-[60%] z-30 bg-primary-block w-[100%] h-24" />
    </div>
  );
};

export default FinishedGame;
