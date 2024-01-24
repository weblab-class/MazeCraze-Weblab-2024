let canvas;
let ctx;

export const updateGlobalCanvas = (curCanvas, curCtx) => { // Get the canvas and context variables from the UseEffect and update the global variables
    canvas = curCanvas;
    ctx = curCtx;
}

const image = (fileName, TILE_SIZE) => { // Load sprite files (STILL WORK IN PROGRESS)
    let img = new Image(TILE_SIZE, TILE_SIZE);
    img.src = `../../sprites/${fileName}`;
    return img;
}

let sprites;

export const LoadSprites = (TILE_SIZE) => {
    // List of sprites
    let wallImage = image("wall.png", TILE_SIZE);
    let groundImage = image("ground.png", TILE_SIZE);
    let playerImage = image("player.png", TILE_SIZE);
    let coinImage = image("coin.png", TILE_SIZE);
    sprites = {wallImage: wallImage, groundImage: groundImage, playerImage: playerImage, coinImage: coinImage};
}

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
                            image = sprites.playerImage;
                            break;
                    }
                })
            }
            switch(tile) {
                case 0: // Tile is ground
                    image = sprites.groundImage;
                    break;
                case 1: // Tile is wall
                    image = sprites.wallImage;
                    break;
                case 2:
                    image = sprites.coinImage;
                    break;
            }
            ctx.drawImage(
                image,
                col * TILE_SIZE,
                row * TILE_SIZE,
                TILE_SIZE,
                TILE_SIZE,
            );
        }
    }
}