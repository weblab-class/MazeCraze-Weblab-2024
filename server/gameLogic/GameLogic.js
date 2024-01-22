let collectedCoin = false;
let playersReady = 0; // HARD CODED IN
let totalPlayers = 1; // HARD CODED IN, CHANGE LATER WHEN OTHER PLAYERS CAN JOIN. SHOULD INSTEAD BE A VARIABLE ACCESSED IN GAMESTATE

const StartGame = () => {
    
}

const CollectCoin = () => {
    // ----------- TO DO ----------
    // Make it so it takes in a player id parameter and increases the player's coin by 1
    collectedCoin = false;
    console.log("Collected Coins!");
}

const RoundTimer = () => {

}

const PlayerReady = () => {
    // ----------- TO DO ----------
    // Make it take in the player_id and the update
    playersReady += 1;
    if (playersReady >= totalPlayers){

    }

}

const MovePlayer = (dir, playerLocation, gridLayout) => {

    //if (gridLayout[playerLocation[0]][playerLocation[1]] == [1]){ // If player is the only entity on tile, replace with ground
        gridLayout[playerLocation[0]][playerLocation[1]] = 0;
    //}else{ // If there are multiple players on the area
        // Remove player from the array
    //}
    let futurePlayerLocation;
    switch(dir){
        case "up":
            futurePlayerLocation = gridLayout[playerLocation[0] - 1][playerLocation[1]]
            if(futurePlayerLocation != 1){ // If next location is not a wall, move player's location there
                playerLocation[0] -= 1;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                collectedCoin = true;
            }
            break;
        case "down":
            futurePlayerLocation = gridLayout[playerLocation[0] + 1][playerLocation[1]]
            if(futurePlayerLocation != 1){ // If next location is not a wall, move player's location there
                playerLocation[0] += 1;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                collectedCoin = true;
            }
            break;
        case "right":
            futurePlayerLocation = gridLayout[playerLocation[0]][playerLocation[1] + 1]
            if(futurePlayerLocation != 1){ // If next location is not a wall, move player's location there
                playerLocation[1] += 1;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                collectedCoin = true;
            }
            break;
        case "left":
            futurePlayerLocation = gridLayout[playerLocation[0]][playerLocation[1] - 1]
            if(futurePlayerLocation != 1){
                playerLocation[1] -= 1;
            }
            if(futurePlayerLocation == 2){ // Check if the next location has a wall
                collectedCoin = true;
            }
            break;
    }
    // TODO: CHECK IF THERE IS ANOTHER PLAYER ON TILE
    gridLayout[playerLocation[0]][playerLocation[1]] = [1]; 
    return [gridLayout, playerLocation];

}

module.exports = {
    MovePlayer,
    CollectCoin
}