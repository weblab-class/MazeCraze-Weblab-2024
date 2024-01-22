import React, { useRef, useEffect } from "react";
import { updateGlobalCanvas, UpdateMaze } from "../../gameLogic/CanvasManager";
import { gridLayout, TILE_SIZE } from "../../gameLogic/GameManager";

const Maze = () => {
    // let gameManager = require("../../gameLogic/GameManager");
    const canvasRef = useRef(null);

    // At mount, 
    useEffect(() => { 
        const curCanvas = canvasRef.current;
        const curCtx = curCanvas.getContext('2d');
        updateGlobalCanvas(curCanvas, curCtx);
        UpdateMaze(gridLayout, TILE_SIZE);
    }, []);

    return (
        <canvas ref={canvasRef} />
    )
    
}

export default Maze;