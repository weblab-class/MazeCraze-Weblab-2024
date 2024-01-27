import React from "react";

const LeaderboardName = ({name, roundCoins}) => {
    return(
        <div className="flex flex-row justify-between">
            <div className="mx-32 my-4">
                <p className="text-3xl">{name}</p>
            </div>
            <div className="mx-32 my-4">
                <p className="text-3xl">{roundCoins}</p>
            </div>
        </div>
    )
}

export default LeaderboardName;