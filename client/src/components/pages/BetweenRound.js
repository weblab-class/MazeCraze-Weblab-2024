import React from "react";
import LeaderboardName from "../modules/LeaderboardName";

const BetweenRound = (props) => {
    return (
        <div className="flex">
            <div className="grow text-center rounded-xl m-16 border-spacing-4 bg-yellow-50 h-96">
                <h1 className="font-custom">Leaderboard</h1>
                <LeaderboardName name="Player 1 (YOU) :)" score={props.playerCoins} />
                <LeaderboardName name="Player 2" score="12" />
                <LeaderboardName name="Player 3" score="9" />
                <LeaderboardName name="Player 4" score="8" />
                <LeaderboardName name="Player 5" score="7" />
            </div>
            <div className="grow">
                
            </div>

        </div>
    )
}

export default BetweenRound;