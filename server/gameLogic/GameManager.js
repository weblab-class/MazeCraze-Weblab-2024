
// 0 - ground
// 1 - wall
// 2 - coin
// [1] - Player 1
// [2] - Player 2
// [3] - Player 3
// [4] - Player 4
// [5] - Hunter 1

const mazeManager = require("./MazeManager");

const TILE_SIZE = 32; // Pixels of each tile
let gridLayout;
let playerLocation;
let coinLocations;
let roundCoinsCount = 5;
let roundStarted = false;

const CreateStartingLayout = () => {
    playerLocation = [];
    coinLocations = [];
    gridLayout = [];

    let mazes = mazeManager.mazes;
    let randomMazeSelect = Math.floor(Math.random() * mazes.length);
    gridLayout = mazes[randomMazeSelect];
    console.log("Section A");

    [playerLocationX, playerLocationY] = GetRandomPlayerLocation();
    playerLocation[0] = playerLocationX;
    playerLocation[1] = playerLocationY;
    for(let i = 0; i < roundCoinsCount; i++){
        coinLocations.push(GetRandomCoinLocation());
    }

    gridLayout[playerLocation[0]][playerLocation[1]] = [1]; // Change depending on player
    for(let i = 0; i < coinLocations.length; i++) {
        gridLayout[coinLocations[i][0]][coinLocations[i][1]] = 2;
    }

    return [playerLocation, coinLocations, gridLayout];

}

const GetRandomPlayerLocation = () => {
    let needsLocation = true;
    while(needsLocation){ // Generate a random location for player
        let randomX = Math.floor(Math.random() * gridLayout.length);
        let randomY = Math.floor(Math.random() * gridLayout[0].length);
        if(gridLayout[randomX][randomY] == 0){
            needsLocation = false;
            return [randomX, randomY];
        }
    }
}

const GetRandomCoinLocation = () => {
    let needsLocation = true;
    while(needsLocation){ // Generate a random location for coin
        let randomX = Math.floor(Math.random() * gridLayout.length);
        let randomY = Math.floor(Math.random() * gridLayout[0].length);
        if(gridLayout[randomX][randomY] == 0){
            needLocation = false;
            return [randomX, randomY];
        }
    }
}

module.exports = {
    TILE_SIZE,
    gridLayout,
    playerLocation,
    coinLocations,
    roundCoinsCount,
    CreateStartingLayout
}