import { mazes } from "./MazeManager";

export const TILE_SIZE = 32; // Pixels of each tile

// 0 - ground
// 1 - wall
// 2 - coin
// [1] - Player 1
// [2] - Player 2
// [3] - Player 3
// [4] - Player 4
// [5] - Hunter 1

// TO DO: PUT THIS IN THE GAMESTATE INSTEAD, BUT GAMEMANAGER SHOULD HAVE THE GRIDLAYOUT SET TO THE BACKEND ONE SINCE OTHER FILES RELY ON THIS ONE;
let randomMazeSelect = Math.floor(Math.random() * mazes.length);
console.log("Selecting Maze:", randomMazeSelect);
export let gridLayout = mazes[randomMazeSelect];

export let playerLocation = [];

while(playerLocation.length === 0){ // Generate a random location for player
    let randomX = Math.floor(Math.random() * gridLayout.length);
    let randomY = Math.floor(Math.random() * gridLayout[0].length);
    if(gridLayout[randomX][randomY] == 0){
        playerLocation[0] = randomX;
        playerLocation[1] = randomY;
        gridLayout[randomX][randomY] = [1]; // Change depending on player
    }
}

const spawnCoin = () => {
    let coinLocation = [];
    while(coinLocation.length === 0){ // Generate a random location for coin
        let randomX = Math.floor(Math.random() * gridLayout.length);
        let randomY = Math.floor(Math.random() * gridLayout[0].length);
        if(gridLayout[randomX][randomY] == 0){
            coinLocation[0] = randomX;
            coinLocation[1] = randomY;
            gridLayout[randomX][randomY] = 2; // Change depending on coin
        }
    }
}

let coinAmount = 10
for(let i = 0; i < coinAmount; i++){
    spawnCoin();
}

gridLayout[playerLocation[0]][playerLocation[1]] = [1];