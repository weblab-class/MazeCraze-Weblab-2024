import React, { useRef, useEffect } from "react";
import { updateGlobalCanvas, LoadSprites } from "../../client-game-logic/CanvasManager";
import {playerReady} from "../../client-socket";

const Maze = () => {
    const canvasRef = useRef(null);

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