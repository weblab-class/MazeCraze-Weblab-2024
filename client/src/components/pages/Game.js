import React from "react";
import "./Game.css";
import Maze from "../modules/Maze.js";

const Game = () => {

    return (
        <div className="bg-primary-bg w-full h-full min-h-screen px-4 py-2">
            <h1 className="font-bold text-center text-4xl text-primary-text">Perks</h1>
            <div className="PerkContainer">
                    <div className="Perk" />
                    <div className="Perk" />
                    <div className="Perk" />
                    <div className="Perk" />
                    <div className="Perk" />
            </div>
            <div className="flex justify-center m-8">
                <Maze />
            </div>
        </div>
    )

}

export default Game;