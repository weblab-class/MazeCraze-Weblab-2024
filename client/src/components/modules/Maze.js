import React, { useRef, useEffect } from "react";

//0 - ground
//1 - wall
//2 - Player 


const Maze = () => {

    const gameLogic = require("../modules/GameLogic");
    const canvasRef = useRef(null);

    const image = (fileName) => {
        const img = new Image(gameLogic.TILE_SIZE, gameLogic.TILE_SIZE);
        img.src = `../../images/${fileName}`;
        console.log(img.src);
        return img;
    }
    
    let wallImage = image("wall");
    let groundImage = image("ground");
    let playerImage = image("player");
    
    let ROW_SIZE = gameLogic.gridLayout.length;
    let COL_SIZE = gameLogic.gridLayout[0].length;

    useEffect(() => {
        UpdateCanvas()
    }, [])

    const UpdateCanvas = (() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        draw(canvas, ctx)
    });
    
    const setCanvasSize = (canvas) => {
        canvas.height = gameLogic.gridLayout.length * gameLogic.TILE_SIZE;
        canvas.width = gameLogic.gridLayout[0].length * gameLogic.TILE_SIZE;
    }
    
    const drawMap = (ctx) => {
        for(let row = 0; row < ROW_SIZE; row++){
            for(let col = 0; col < COL_SIZE; col++){
                const tile = gameLogic.gridLayout[row][col]; // Get a specific row
                let image = null;
                switch(tile) {
                    case 0:
                        ctx.fillStyle="blue";
                        image = groundImage;
                        break;
                    case 1:
                        ctx.fillStyle="black";
                        image = wallImage;
                        break;
                }
    
                // ctx.drawImage(
                //     image,
                //     col * gameLogic.TILE_SIZE*2,
                //     row * gameLogic.TILE_SIZE*2,
                //     gameLogic.TILE_SIZE,
                //     gameLogic.TILE_SIZE,
                // );
                ctx.fillRect(
                    col * gameLogic.TILE_SIZE,
                    row * gameLogic.TILE_SIZE,
                    gameLogic.TILE_SIZE,
                    gameLogic.TILE_SIZE
                )
            }
        }
    }
    
    const draw = (canvas, ctx) => {
        setCanvasSize(canvas);
        drawMap(ctx);
    }

    return (
        <canvas ref={canvasRef} />
    )
    
}

export default Maze;