import React from "react";

const LeaderboardName = (props) => {
    return(
        <div className="flex flex-row justify-between">
            <div className="mx-32 my-4">
                <p className="">{props.name}</p>
            </div>
            <div className="mx-32 my-4">
                <p className="">{props.score}</p>
            </div>
        </div>
    )
}

export default LeaderboardName;