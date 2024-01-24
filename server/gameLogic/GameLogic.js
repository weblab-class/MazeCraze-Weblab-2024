const gameManager = require("./GameManager");

let collectedCoin = false;

const CollectCoin = () => {
    // ----------- TO DO ----------
    // Make it so it takes in a player id parameter and increases the player's coin by 1
    collectedCoin = false;
    console.log("Collected Coins!");
}

const MovePlayer = (dir) => {
    let gridLayout = gameManager.gameState.gridLayout;
    let currentPlayerLocation = gameManager.gameState.playerStats[0].location; // HARD CODED TO FIRST PLAYER

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
                moved = true;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                collectedCoin = true;
            }
            break;
        case "down":
            futurePlayerLocation = gridLayout[currentPlayerLocation[0] + 1][currentPlayerLocation[1]]
            if(futurePlayerLocation != 1){ // If next location is not a wall, move player's location there
                currentPlayerLocation[0] += 1;
                moved = true;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                collectedCoin = true;
            }
            break;
        case "right":
            futurePlayerLocation = gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1] + 1]
            if(futurePlayerLocation != 1){ // If next location is not a wall, move player's location there
                currentPlayerLocation[1] += 1;
                moved = true;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                collectedCoin = true;
            }
            break;
        case "left":
            futurePlayerLocation = gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1] - 1]
            if(futurePlayerLocation != 1){
                currentPlayerLocation[1] -= 1;
                moved = true;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                collectedCoin = true;
            }
            break;
    }
    // TODO: CHECK IF THERE IS ANOTHER PLAYER ON TILE
    gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1]] = [1]; 

    // moved variable is to handle if two keys are pressed. If one of the movements hits a wall, moved variable prevents the server from sending an old updated grid.
    return [collectedCoin, moved];

}

module.exports = {
    MovePlayer,
    CollectCoin
}