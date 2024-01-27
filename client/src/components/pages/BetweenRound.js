import React from "react";
import LeaderboardName from "../modules/LeaderboardName";

const BetweenRound = ({lobbyGameState}) => {
    return (
        <div className="bg-primary-bg flex items-center justify-center h-screen w-screen flex-row overflow-hidden font-custom tracking-widest">

            <div className="text-5xl text-primary-text font-bold grow text-center rounded-xl mx-16 border-spacing-4 bg-white h-3/4">
                <h1 className="font-custom my-4">Leaderboard</h1>

                {// This is so that PLAYER and SCORE are the first row
                }
                <LeaderboardName name="PLAYER" roundCoins="SCORE"/>

                {Object.keys(lobbyGameState.playerStats).map((userId) => (
                    <LeaderboardName name={lobbyGameState.playerStats[userId].name} roundCoins={lobbyGameState.playerStats[userId].roundCoins}/>
                ))}
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