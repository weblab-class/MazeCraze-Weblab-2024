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
    let playerImage = image("player.png", TILE_SIZE);
    let coinImage = image("mazeCoin.png", TILE_SIZE);
    let TLWall = image("TopLeftWall.png", TILE_SIZE);
    let TRWall = image("TopRightWall.png", TILE_SIZE);
    let BLWall = image("BottomLeftWall.png", TILE_SIZE);
    let BRWall = image("BottomRightWall.png", TILE_SIZE);
    let TTWall = image("TopTipWall.png", TILE_SIZE);
    let BTWall = image("BottomTipWall.png", TILE_SIZE);
    let RTWall = image("RightTipWall.png", TILE_SIZE);
    let LTWall = image("LeftTipWall.png", TILE_SIZE);
    let TTripleWall = image("TopTripleWall.png", TILE_SIZE);
    let BTripleWall = image("BottomTripleWall.png", TILE_SIZE);
    let RTripleWall = image("RightTripleWall.png", TILE_SIZE);
    let LTripleWall = image("LeftTripleWall.png", TILE_SIZE);
    let VertWall = image("VerticalWall.png", TILE_SIZE);
    let HorizWall = image("HorizontalWall.png", TILE_SIZE);
    let IntersectWall = image("IntersectWall.png", TILE_SIZE);
    let AloneWall = image("AloneWall.png", TILE_SIZE);
    let MouseUp = image("MouseUp.png", TILE_SIZE);
    let MouseRight = image("MouseRight.png", TILE_SIZE);
    let MouseDown = image("MouseDown.png", TILE_SIZE);
    let MouseLeft = image("MouseLeft.png", TILE_SIZE);

    sprites = {
        playerImage: playerImage, 
        coinImage: coinImage,
        TLWall: TLWall,
        TRWall: TRWall,
        BLWall: BLWall,
        BRWall: BRWall,
        TTWall: TTWall,
        BTWall: BTWall,
        RTWall: RTWall,
        LTWall: LTWall,
        TTripleWall: TTripleWall,
        BTripleWall: BTripleWall,
        RTripleWall: RTripleWall,
        LTripleWall: LTripleWall,
        VertWall: VertWall,
        HorizWall: HorizWall,
        IntersectWall: IntersectWall,
        AloneWall: AloneWall,
        MouseUp: MouseUp,
        MouseRight: MouseRight,
        MouseDown: MouseDown,
        MouseLeft: MouseLeft,
    };
}

// THIS IS THE MAIN FUNCTION TO DRAW A NEW MAP GIVEN A GRIDLAYOUT AND TILE SIZE
export const UpdateMaze = (lobbyGameState, TILE_SIZE, userId) => {
    let gridLayout = lobbyGameState.gridLayout;

    let ROW_SIZE = gridLayout.length; // Defines how many maze rows
    let COL_SIZE = gridLayout[0].length; // Defines how many maze columns
    canvas.height = ROW_SIZE * TILE_SIZE;
    canvas.width = COL_SIZE * TILE_SIZE;

    // This runs through each tile and displays which tile type it is (wall, ground, player, etc)
    for(let row = 0; row < ROW_SIZE; row++){
        for(let col = 0; col < COL_SIZE; col++){
            const tile = gridLayout[row][col]; // Get a specific row and column position of tile
            let image = null;

            // MAZE HAZE TILES
            if(lobbyGameState.hasMazeHaze && Math.sqrt((row - lobbyGameState.playerStats[userId].location[0])**2 + (col - lobbyGameState.playerStats[userId].location[1])**2) >= 6){

                image = sprites.playerImage;
                ctx.drawImage(
                    image,
                    col * TILE_SIZE,
                    row * TILE_SIZE,
                    TILE_SIZE,
                    TILE_SIZE,
                );
            }
            else{
                if(tile.constructor === Array){
                    image = sprites.playerImage;
                    ctx.drawImage(
                        image,
                        col * TILE_SIZE,
                        row * TILE_SIZE,
                        TILE_SIZE,
                        TILE_SIZE,
                    );
                }
                switch(tile) {
                    case 0: // Tile is ground
                        // image = sprites.groundImkage;
                        ctx.fillStyle="#0B1354"
                        ctx.fillRect(
                            col * TILE_SIZE,
                            row * TILE_SIZE,
                            TILE_SIZE,
                            TILE_SIZE
                        )
                        break;
                    case 1: // Tile is wall
                        // image = sprites.wallImage;
                        let wallAbove = false;
                        let wallBelow = false;
                        let wallRight = false;
                        let wallLeft = false;
    
                        if(row > 0 && gridLayout[row-1][col] == 1){
                            wallAbove = true;
                        }
                        if(row < (ROW_SIZE-1) && gridLayout[row+1][col] == 1){
                            wallBelow = true;
                        }
                        if(col > 0 && gridLayout[row][col-1] == 1){
                            wallLeft = true;
                        }
                        if(col < (COL_SIZE-1) && gridLayout[row][col+1] == 1){
                            wallRight = true;
                        }
    
                        if(wallAbove && wallBelow && wallLeft && wallRight){
                            image = sprites.IntersectWall;
                        }
                        else if(wallBelow && wallLeft && wallRight){
                            image = sprites.TTripleWall;
                        }
                        else if(wallAbove && wallLeft && wallRight){
                            image = sprites.BTripleWall;
                        }
                        else if(wallAbove && wallBelow && wallLeft){
                            image = sprites.RTripleWall
                        }
                        else if(wallAbove && wallBelow && wallRight){
                            image = sprites.LTripleWall;
                        }
                        else if(wallAbove && wallBelow){
                            image = sprites.VertWall;
                        }
                        else if(wallRight && wallLeft){
                            image = sprites.HorizWall;
                        }
                        else if(wallAbove && wallRight){
                            image = sprites.BLWall;
                        }
                        else if(wallAbove && wallLeft){
                            image = sprites.BRWall;
                        }
                        else if(wallBelow && wallRight){
                            image = sprites.TLWall;
                        }
                        else if(wallBelow && wallLeft){
                            image = sprites.TRWall;
                        }
                        else if(wallAbove){
                            image = sprites.BTWall;
                        }
                        else if(wallBelow){
                            image = sprites.TTWall;
                        }
                        else if(wallLeft){
                            image = sprites.RTWall;
                        }
                        else if(wallRight){
                            image = sprites.LTWall;
                        }
                        else{
                            image = sprites.AloneWall;
                        }
    
                        ctx.drawImage(
                            image,
                            col * TILE_SIZE,
                            row * TILE_SIZE,
                            TILE_SIZE,
                            TILE_SIZE,
                        );
    
                        break;
                    case 2:
                        image = sprites.coinImage;
                        ctx.drawImage(
                            image,
                            col * TILE_SIZE,
                            row * TILE_SIZE,
                            TILE_SIZE,
                            TILE_SIZE,
                        );
                        break;
                    case 31: // MOUSE UP
                        image = sprites.MouseUp;
                        ctx.drawImage(
                            image,
                            col * TILE_SIZE,
                            row * TILE_SIZE,
                            TILE_SIZE,
                            TILE_SIZE,
                        );
                        break;
                    case 32: // MOUSE RIGHT
                        image = sprites.MouseRight;
                        ctx.drawImage(
                            image,
                            col * TILE_SIZE,
                            row * TILE_SIZE,
                            TILE_SIZE,
                            TILE_SIZE,
                        );
                        break;
                    case 33: // MOUSE DOWN
                        image = sprites.MouseDown;
                        ctx.drawImage(
                            image,
                            col * TILE_SIZE,
                            row * TILE_SIZE,
                            TILE_SIZE,
                            TILE_SIZE,
                        );
                        break;
                    case 34: // MOUSE LEFT
                        image = sprites.MouseLeft;
                        ctx.drawImage(
                            image,
                            col * TILE_SIZE,
                            row * TILE_SIZE,
                            TILE_SIZE,
                            TILE_SIZE,
                        );
                        break;
                }
            }    
        }
    }
}