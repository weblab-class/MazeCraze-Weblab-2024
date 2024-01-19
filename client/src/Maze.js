import React, { useRef, useEffect } from "react";
import { drawCanvas } from "./components/modules/CanvasManager";

let canvas;
let ctx;
const gameLogic = require("../modules/GameLogic");

const updateGlobalCanvas = (curCanvas, curCtx) => { // Get the canvas and context variables from the UseEffect and update the global variables
    canvas = curCanvas;
    ctx = curCtx;
}

const image = (fileName) => { // Load sprite files (STILL WORK IN PROGRESS)
    const img = new Image(gameLogic.TILE_SIZE, gameLogic.TILE_SIZE);
    img.src = `../../images/${fileName}`;
    console.log(img.src);
    return img;
}

// List of sprites
let wallImage = image("wall");
let groundImage = image("ground");
let playerImage = image("player");

// THIS IS THE MAIN FUNCTION TO DRAW A NEW MAP GIVEN A GRIDLAYOUT AND TILE SIZE
const UpdateMaze = (gridLayout, TILE_SIZE) => {
    let ROW_SIZE = gridLayout.length; // Defines how many maze rows
    let COL_SIZE = gridLayout[0].length; // Defines how many maze columns
    canvas.height = ROW_SIZE * TILE_SIZE;
    canvas.width = COL_SIZE * TILE_SIZE;

    // This runs through each tile and displays which tile type it is (wall, ground, player, etc)
    for(let row = 0; row < ROW_SIZE; row++){
        for(let col = 0; col < COL_SIZE; col++){
            const tile = gridLayout[row][col]; // Get a specific row and column position of tile
            let image = null;
            switch(tile) {
                case 0: // Tile is ground
                    ctx.fillStyle="blue";
                    image = groundImage;
                    break;
                case 1: // Tile is wall
                    ctx.fillStyle="black";
                    image = wallImage;
                    break;
            }

            // ctx.drawImage( WORK IN PROGRESS
            //     image,
            //     col * TILE_SIZE*2,
            //     row * TILE_SIZE*2,
            //     TILE_SIZE,
            //     TILE_SIZE,
            // );
            ctx.fillRect(
                col * TILE_SIZE,
                row * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE
            )
        }
    }
}

const Maze = () => {

    const canvasRef = useRef(null);

    // At mount, 
    useEffect(() => { 
        
        const curCanvas = canvasRef.current;
        const curCtx = curCanvas.getContext('2d');
        updateGlobalCanvas(curCanvas, curCtx);

        UpdateMaze(gameLogic.gridLayout, gameLogic.TILE_SIZE);
    }, []);

    return (
        <canvas ref={canvasRef} />
    )
    
}

export default Maze;