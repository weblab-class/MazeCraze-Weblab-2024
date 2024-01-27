import React, {useEffect, useState} from "react";
import "./Game.css";
import Maze from "../modules/Maze.js";
import Timer from "../modules/Timer.js"
import BetweenRound from "./BetweenRound.js";
import {socket} from "../../client-socket";


const Game = ({lobbyId, userId}) => {

    const [isBetweenRound, setIsBetweenRound] = useState(false);
    const [playerStats, setPlayerStats] = useState([]);

    useEffect(() => {
        socket.on("EndRound", (data) => {
            setPlayerStats(data.playerStats); // TO DO, MAKE IT RECEIVE MULTIPLE PLAYER COINS
            setIsBetweenRound(true);
        });
        return () => (
            socket.off("EndRound")
        );
    },[]);

    return (
        <>
            { isBetweenRound ? (
                <BetweenRound playerStats={playerStats}/>
            ):(
                <div className="bg-primary-bg w-full h-full min-h-screen px-4 py-2 font-custom tracking-widest">
                <h1 className="font-bold text-center text-4xl text-primary-text">Perks</h1>
                <div className="PerkContainer">
                        <div className="Perk" />
                        <div className="Perk" />
                        <div className="Perk" />
                        <div className="Perk" />
                        <div className="Perk" />
                </div>
                <div className="flex justify-center m-8 h-4/5">
                    <Maze lobbyId={lobbyId} userId={userId}/>
                </div>
                <Timer />
            </div>
            
            )}
        </>
    )

}

export default Game;
