import React, { useState, useEffect } from "react";
import { socket } from "../../client-socket";
import { Link } from "react-router-dom";
import LeaderboardCard from "../modules/LeaderboardCard";
const FinishedGame = ({ lobbyGameState }) => {
  const comparePlayer = (player_one_id, player_two_id) => {
    const all_players = lobbyGameState.playerStats;
    const first_coins = all_players[player_one_id].totalCoins;
    const second_coins = all_players[player_two_id].totalCoins;
    return second_coins - first_coins;
  };
  return (
    <div className="flex flex-col font-custom tracking-widest bg-primary-bg w-full h-full min-h-screen items-center justify-center">
      <div className="px-10 py-10 bg-primary-block text-2xl text-primary-text flex flex-col">
        FINAL LEADERBOARD
        {Object.keys(lobbyGameState.playerStats)
          .sort(comparePlayer)
          .map((userId, i) => (
            <LeaderboardCard key={i} index={i} playerData={lobbyGameState.playerStats[userId]} />
          ))}
      </div>
      <Link to="/" className="text-5xl text-center text-primary-text">
        RETURN BACK TO MAIN MENU
      </Link>
    </div>
  );
};

export default FinishedGame;
