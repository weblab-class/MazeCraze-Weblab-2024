const gameManager = require("./GameManager");
const serverSocket = require("../server-socket");

const CollectCoin = (lobbyId, userId) => {
    // ----------- TO DO ----------
    // Make it so it takes in a player id parameter and increases the player's coin by 1
    collectedCoin = false;
    gameManager.gameStates[lobbyId].playerStats[userId].roundCoins += 1;
    let [coinLocationX, coinLocationY] = gameManager.GetRandomCoinLocation(gameManager.gameStates[lobbyId].gridLayout);
    gameManager.gameStates[lobbyId].gridLayout[coinLocationX][coinLocationY] = 2;
}

const MovePlayer = (dir, lobbyId, userId) => {
    let gridLayout = gameManager.gameStates[lobbyId].gridLayout;
    let currentPlayerLocation = gameManager.gameStates[lobbyId].playerStats[userId].location; // HARD CODED TO FIRST PLAYER

    //if (gridLayout[playerLocation[0]][playerLocation[1]] == [1]){ // If player is the only entity on tile, replace with ground
    gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1]] = 0;
    //}else{ // If there are multiple players on the area
        // Remove player from the array
    //}
    let futurePlayerLocation;
    let moved = false;
    switch(dir){
        case "up":
            futurePlayerLocation = gridLayout[currentPlayerLocation[0] - 1][currentPlayerLocation[1]]
            if(futurePlayerLocation != 1){ // If next location is not a wall, move player's location there
                currentPlayerLocation[0] -= 1;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                CollectCoin(lobbyId, userId);
            }
            break;
        case "down":
            futurePlayerLocation = gridLayout[currentPlayerLocation[0] + 1][currentPlayerLocation[1]]
            if(futurePlayerLocation != 1){ // If next location is not a wall, move player's location there
                currentPlayerLocation[0] += 1;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                CollectCoin(lobbyId, userId);
            }
            break;
        case "right":
            futurePlayerLocation = gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1] + 1]
            if(futurePlayerLocation != 1){ // If next location is not a wall, move player's location there
                currentPlayerLocation[1] += 1;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                CollectCoin(lobbyId, userId);
            }
            break;
        case "left":
            futurePlayerLocation = gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1] - 1]
            if(futurePlayerLocation != 1){
                currentPlayerLocation[1] -= 1;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                CollectCoin(lobbyId, userId);
            }
            break;
    }
    // TODO: CHECK IF THERE IS ANOTHER PLAYER ON TILE
    gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1]] = [1]; 

}

module.exports = {
    MovePlayer,
}