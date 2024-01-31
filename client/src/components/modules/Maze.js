import React, { useRef, useEffect } from "react";
import { handleDownInput, handleUpInput } from "../../client-game-logic/Player.js";
import { updateGlobalCanvas, LoadSprites } from "../../client-game-logic/CanvasManager";
import {playerReady} from "../../client-socket";
import { get } from "../../utilities.js";

const Maze = ({lobbyId, userId}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let keybinds;
        get("/api/user").then((data) => {
            keybinds = data.user.keybinds;
            window.addEventListener("keydown", (e) => {handleDownInput(e, keybinds)});
            window.addEventListener("keyup", (e) => {handleUpInput(e, keybinds)});
        });
        
        return () => {
            window.removeEventListener("keydown", (e) => {handleDownInput(e, keybinds)});
            window.removeEventListener("keyup", (e) => {handleDownInput(e, keybinds)});
        }
    }, []);

    // At mount, which is at the start of each round
    useEffect(() => { 
        if(userId){
            const curCanvas = canvasRef.current;
            const curCtx = curCanvas.getContext('2d');
            updateGlobalCanvas(curCanvas, curCtx);
            LoadSprites(24); // HARD CODED IN, DON'T CARE, COPE

            // When canvas is ready and assigned, tell server that player is ready to start round
            playerReady(lobbyId, userId);
        }
    }, [userId]);

    return (
        <canvas ref={canvasRef} />
    )
    
}

export default Maze;