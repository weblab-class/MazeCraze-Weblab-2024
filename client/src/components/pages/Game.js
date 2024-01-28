import React, {useEffect, useState} from "react";
import "./Game.css";
import Maze from "../modules/Maze.js";
import Timer from "../modules/Timer.js"
import BetweenRound from "./BetweenRound.js";
import {socket} from "../../client-socket";


const Game = ({lobbyId, userId}) => {

    const [isBetweenRound, setIsBetweenRound] = useState(false);
    const [lobbyGameState, setLobbyGameState] = useState({});

    useEffect(() => {
        socket.on("EndRound", (data) => {
            setLobbyGameState(data.lobbyGameState)
            setIsBetweenRound(true);
        });
        return () => (
            socket.off("EndRound", (data) => {
                setLobbyGameState(data.lobbyGameState)
                setIsBetweenRound(true);
            })
        );
    },[]);

    return (
        <>
            { isBetweenRound ? (
                <BetweenRound lobbyGameState={lobbyGameState}/>
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
