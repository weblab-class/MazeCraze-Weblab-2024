import React, { useRef, useEffect } from "react";
import { handleDownInput, handleUpInput } from "../../client-game-logic/Player.js";
import { updateGlobalCanvas, LoadSprites } from "../../client-game-logic/CanvasManager";
import {playerReady} from "../../client-socket";

const Maze = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        window.addEventListener("keydown", handleDownInput);
        window.addEventListener("keyup", handleUpInput);
        
        return () => {
            window.removeEventListener("keydown", handleDownInput);
            window.addEventListener("keyup", handleUpInput);
        }
    }, []);

    // At mount, which is at the start of each round
    useEffect(() => { 
        const curCanvas = canvasRef.current;
        const curCtx = curCanvas.getContext('2d');
        updateGlobalCanvas(curCanvas, curCtx);
        LoadSprites(32); // HARD CODED IN, DON'T CARE, COPE

        // When canvas is ready and assigned, tell server that player is ready to start round
        playerReady();
    }, []);

    return (
        <canvas ref={canvasRef} />
    )
    
}

export default Maze;