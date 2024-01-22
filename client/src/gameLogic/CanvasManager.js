import { TILE_SIZE } from "./GameManager";

let canvas;
let ctx;

export const updateGlobalCanvas = (curCanvas, curCtx) => { // Get the canvas and context variables from the UseEffect and update the global variables
    canvas = curCanvas;
    ctx = curCtx;
}

const image = (fileName) => { // Load sprite files (STILL WORK IN PROGRESS)
    let img = new Image(TILE_SIZE, TILE_SIZE);
    img.src = `../../sprites/${fileName}`;
    console.log(img.src)
    return img;
}

// // List of sprites
let wallImage = image("wall.png");
let groundImage = image("ground.png");
let playerImage = image("player.png");
let coinImage = image("coin.png")

// THIS IS THE MAIN FUNCTION TO DRAW A NEW MAP GIVEN A GRIDLAYOUT AND TILE SIZE
export const UpdateMaze = (gridLayout, TILE_SIZE) => {
    let ROW_SIZE = gridLayout.length; // Defines how many maze rows
    let COL_SIZE = gridLayout[0].length; // Defines how many maze columns
    canvas.height = ROW_SIZE * TILE_SIZE;
    canvas.width = COL_SIZE * TILE_SIZE;

    // This runs through each tile and displays which tile type it is (wall, ground, player, etc)
    for(let row = 0; row < ROW_SIZE; row++){
        for(let col = 0; col < COL_SIZE; col++){
            const tile = gridLayout[row][col]; // Get a specific row and column position of tile
            let image = null;
            if(tile.constructor === Array){
                tile.map((entity) => {
                    switch(entity){
                        case 1:
                            image = playerImage;
                            ctx.fillStyle="red";
                    }
                })
            }
            switch(tile) {
                case 0: // Tile is ground
                    ctx.fillStyle="#0B1354";
                    image = groundImage;
                    break;
                case 1: // Tile is wall
                    ctx.fillStyle="#006BE5";
                    image = wallImage;
                    break;
                case 2:
                    ctx.fillStyle="yellow";
                    image = coinImage;
            }

            ctx.drawImage(
                image,
                col * TILE_SIZE,
                row * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE,
            );
            // ctx.fillRect(
            //     col * TILE_SIZE,
            //     row * TILE_SIZE,
            //     TILE_SIZE,
            //     TILE_SIZE
            // )
        }
    }
}
// const drawCanvas = (drawState, canvasRef) => {
//     // use canvas reference of canvas element to get reference to canvas object
//     canvas = canvasRef.current;
//     if (!canvas) return;
//     const context = canvas.getContext("2d");
  
//     // clear the canvas to black
//     context.fillStyle = "black";
//     context.fillRect(0, 0, canvas.width, canvas.height);
  
    
// };

console.log("PASSED THROUGH UPDATE MAZE");

// export default{
//     updateGlobalCanvas, 
//     UpdateMaze
// };

// module.exports = {
//     updateGlobalCanvas,
//     UpdateMaze
// }