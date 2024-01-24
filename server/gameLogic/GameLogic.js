const gameManager = require("./GameManager");

let collectedCoin = false;
let playersReady = 0; // HARD CODED IN
let totalPlayers = 1; // HARD CODED IN, CHANGE LATER WHEN OTHER PLAYERS CAN JOIN. SHOULD INSTEAD BE A VARIABLE ACCESSED IN GAMESTATE

const CollectCoin = () => {
    // ----------- TO DO ----------
    // Make it so it takes in a player id parameter and increases the player's coin by 1
    collectedCoin = false;
    console.log("Collected Coins!");
}



const MovePlayer = (dir) => {

    //if (gridLayout[playerLocation[0]][playerLocation[1]] == [1]){ // If player is the only entity on tile, replace with ground
    gameManager.gridLayout[gameManager.playerLocation[0]][gameManager.playerLocation[1]] = 0;
    //}else{ // If there are multiple players on the area
        // Remove player from the array
    //}
    let futurePlayerLocation;
    let moved = false;
    switch(dir){
        case "up":
            futurePlayerLocation = gameManager.gridLayout[gameManager.playerLocation[0] - 1][gameManager.playerLocation[1]]
            if(futurePlayerLocation != 1){ // If next location is not a wall, move player's location there
                gameManager.playerLocation[0] -= 1;
                moved = true;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                collectedCoin = true;
            }
            break;
        case "down":
            futurePlayerLocation = gameManager.gridLayout[gameManager.playerLocation[0] + 1][gameManager.playerLocation[1]]
            if(futurePlayerLocation != 1){ // If next location is not a wall, move player's location there
                gameManager.playerLocation[0] += 1;
                moved = true;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                collectedCoin = true;
            }
            break;
        case "right":
            futurePlayerLocation = gameManager.gridLayout[gameManager.playerLocation[0]][gameManager.playerLocation[1] + 1]
            if(futurePlayerLocation != 1){ // If next location is not a wall, move player's location there
                gameManager.playerLocation[1] += 1;
                moved = true;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                collectedCoin = true;
            }
            break;
        case "left":
            futurePlayerLocation = gameManager.gridLayout[gameManager.playerLocation[0]][gameManager.playerLocation[1] - 1]
            if(futurePlayerLocation != 1){
                gameManager.playerLocation[1] -= 1;
                moved = true;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                collectedCoin = true;
            }
            break;
    }
    // TODO: CHECK IF THERE IS ANOTHER PLAYER ON TILE
    gameManager.gridLayout[gameManager.playerLocation[0]][gameManager.playerLocation[1]] = [1]; 

    // moved variable is to handle if two keys are pressed. If one of the movements hits a wall, moved variable prevents the server from sending an old updated grid.
    return [collectedCoin, moved];

}

module.exports = {
    MovePlayer,
    CollectCoin
}