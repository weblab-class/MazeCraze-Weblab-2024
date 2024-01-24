import React from "react";

const LeaderboardName = (props) => {
    return(
        <div className="flex flex-row justify-evenly">
            <div>{props.name}</div>
            <div>{props.score}</div>
        </div>
    )
}

export default LeaderboardName;