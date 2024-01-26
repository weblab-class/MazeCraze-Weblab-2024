import React from "react";
import LeaderboardName from "../modules/LeaderboardName";

const BetweenRound = (props) => {
    return (
        <div className="bg-primary-bg flex items-center justify-center h-screen w-screen flex-row overflow-hidden font-custom tracking-widest">
            
            <div className="text-5xl text-primary-text font-bold grow text-center rounded-xl mx-16 border-spacing-4 bg-white h-3/4">
                <h1 className="font-custom my-4">Leaderboard</h1>
                <LeaderboardName name="Player 1" score={props.playerCoins} />
                <LeaderboardName name="Player 2" score="12" />
                <LeaderboardName name="Player 3" score="9" />
                <LeaderboardName name="Player 4" score="8" />
                <LeaderboardName name="Player 5" score="7" />
            </div>
            <div className="flex flex-col h-3/4 justify-around">
                <div className="text-4xl text-primary-text font-bold grow text-center rounded-xl mx-16 max-h-96 border-spacing-4 bg-white">
                    <h1 className="font-custom my-8">Current Round: 1</h1>
                    <h1 className="font-custom my-8">Current Perks:</h1>
                    <h1 className="font-custom my-8">Round Winner: Player 1</h1>
                </div>
                <div className="text-4xl text-primary-text font-bold text-center rounded-xl mx-16 h-16 bg-white"
                onClick>
                    <h1 className="p-4">NEXT GAME</h1>
                </div>
            </div>
        </div>
    )
}

export default BetweenRound;