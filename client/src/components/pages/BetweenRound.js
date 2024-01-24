import React from "react";
import LeaderboardName from "../modules/LeaderboardName";

const BetweenRound = () => {
    return (
        <div className="flex">
            <div className="grow text-center rounded-xl m-16 border-spacing-4 bg-yellow-50 h-96">
                <h1 className="font-custom">Leaderboard</h1>
                <LeaderboardName name="Christopher Franco" score="93487389" />
                <LeaderboardName name="Christopher Franco" score="93487389" />
                <LeaderboardName name="Christopher Franco" score="93487389" />
                <LeaderboardName name="Christopher Franco" score="93487389" />
                <LeaderboardName name="Christopher Franco" score="93487389" />
                <LeaderboardName name="Christopher Franco" score="93487389" />
            </div>
            <div className="grow">
                
            </div>

        </div>
    )
}

export default BetweenRound;