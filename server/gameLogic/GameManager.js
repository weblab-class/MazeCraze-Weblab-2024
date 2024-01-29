// 0 - ground
// 1 - wall
// 2 - coin
// [1] - Player 1
// [2] - Player 2
// [3] - Player 3
// [4] - Player 4
// [5] - Hunter 1

const mazeManager = require("./MazeManager");
// const serverSocket = require("../server-socket.js"); THIS CAUSES CYCLIC DEPENDENCY

const TILE_SIZE = 24; // Pixels of each tile
let roundCoinsCount = 5;

let gameStates = {};

const CreateStartingLayout = (lobbyGameState) => {
  startingPlayerLocations = {};
  startingCoinLocations = [];
  startingGridLayout = [];

  let mazes = [...mazeManager.mazes];
  let randomMazeSelect = Math.floor(Math.random() * mazes.length);
  startingGridLayout = [...mazes[randomMazeSelect]];
  startingGridLayout = [ // HARD CODED, FIGURE OUT HOW TO NOT LINK ARRAYS
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  for(const userId of Object.keys(lobbyGameState.playerStats)){
    [playerLocationY, playerLocationX] = GetRandomPlayerLocation(startingGridLayout);
    startingPlayerLocations[userId] = [playerLocationY, playerLocationX];
    startingGridLayout[playerLocationY][playerLocationX] = [userId]
  }

  for (let i = 0; i < roundCoinsCount; i++) {
    startingCoinLocations.push(GetRandomCoinLocation(startingGridLayout));
    startingGridLayout[startingCoinLocations[i][0]][startingCoinLocations[i][1]] = 2;
  }

  return [startingPlayerLocations, startingCoinLocations, startingGridLayout];
};

const GetRandomPlayerLocation = (gridLayout) => {
  let needsLocation = true;
  while (needsLocation) {
    // Generate a random location for player
    let randomY = Math.floor(Math.random() * gridLayout.length);
    let randomX = Math.floor(Math.random() * gridLayout[0].length);
    if (gridLayout[randomY][randomX] == 0) {
      needsLocation = false;
      return [randomY, randomX];
    }
  }
};

const GetRandomCoinLocation = (gridLayout) => {
  let needsLocation = true;
  while (needsLocation) {
    // Generate a random location for coin
    let randomY = Math.floor(Math.random() * gridLayout.length);
    let randomX = Math.floor(Math.random() * gridLayout[0].length);
    if (gridLayout[randomY][randomX] == 0) {
      needLocation = false;
      return [randomY, randomX];
    }
  }
};

// LOADS ACTIVATED PERKS AT THE START OF THE ROUND
const LoadActivatedPerks = (lobbyId, crumblingWallsInterval, wanderingCoinsMoveInterval) => {
  lobbyGameState = gameStates[lobbyId];
  for(const perk of lobbyGameState.activatedPerks){

    // CRUMBLING WALLS PERK
    if(perk == "Crumbling Walls"){
      crumblingWallsInterval[lobbyId] = setInterval(() => {
        if(lobbyGameState.in_round){
          RemoveWall(lobbyGameState);
        }
        else{
          clearInterval(crumblingWallsInterval[lobbyId]);
        }
      }, 1000) // CURRENTLY REMOVES A WALLS EVERY SECONDS
    }
    // HERMES BOOTS PERK
    else if(perk == "Hermes Boots"){
      lobbyGameState.playerSpeed *= 1.5;
    }

    // MEDUSA COINS PERK
    else if(perk == "Hydra Coins"){
      lobbyGameState.hasHydraCoins = true; // Spawning new coins is handled in GameLogic.js
    }

    // WANDERING COINS PERK
    else if(perk == "Wandering Coins"){
      wanderingCoinsMoveInterval[lobbyId] = setInterval(() => {
        for(let i = 0; i < lobbyGameState.wanderingCoinDirections.length; i++){
          if(lobbyGameState.wanderingCoinDirections[i] == null){
            lobbyGameState.wanderingCoinDirections[i] = GenerateNewCoinDirection();
          }
        }
        if(lobbyGameState.in_round){
          MoveCoin(lobbyGameState);
        }
        else{
          clearInterval(wanderingCoinsMoveInterval[lobbyId]);
        }
      }, 1000) // CURRENTLY MOVES COINS EVERY SECOND
    }
  };
}

// FOR CRUMBLING WALLS PERK
const RemoveWall = (lobbyGameState) => {
  let gridLayout = lobbyGameState.gridLayout;

  const validWallDeletion = (randomY, randomX) => {
    let adjacentVerticalWalls = 0;
    let adjacentHorizontalWalls = 0;
    if(gridLayout[randomY+1][randomX] == 1){
      adjacentVerticalWalls += 1;
    }
    if(gridLayout[randomY-1][randomX] == 1){
      adjacentVerticalWalls += 1;
    }
    if(gridLayout[randomY][randomX+1] == 1){
      adjacentHorizontalWalls += 1;
    }
    if(gridLayout[randomY][randomX-1] == 1){
      adjacentHorizontalWalls += 1;
    }

    if(adjacentVerticalWalls == 2 && adjacentHorizontalWalls == 0){ // VALID
      return true;
    }
    else if(adjacentVerticalWalls == 0 && adjacentHorizontalWalls == 2){ // VALID
      return true;
    }
    else {
      return false;
    }
    
  } 

  let needsLocation = true;
  while (needsLocation) {
    // Pick random location for wall deletion
    let randomY = Math.floor(Math.random() * (gridLayout.length-2)) + 1;
    let randomX = Math.floor(Math.random() * (gridLayout[0].length-2)) + 1;
    if (gridLayout[randomY][randomX] == 1 && validWallDeletion(randomY, randomX)) {
      needLocation = false;
      gridLayout[randomY][randomX] = 0;
      return;
    }
  }
}

const GenerateNewCoinDirection = () => {
  let randomNumber = Math.floor(Math.random() * 4);
  if(randomNumber == 0){
    return "up";
  }
  else if(randomNumber == 1){
    return "down";
  }
  else if(randomNumber == 2){
    return "right";
  }
  else{
    return "left";
  }
}

// FOR WANDERING COINS PERK
const MoveCoin = (lobbyGameState) => {

  const pickNewDirection = (availableDirections) => {
    let randomDirectionGenerator = Math.floor(Math.random() * availableDirections.length);
    return availableDirections[randomDirectionGenerator];
  }

  for(let i = 0; i < lobbyGameState.coinLocations.length; i++){
    let currentY = lobbyGameState.coinLocations[i][0]; // Gets specific coin location
    let currentX = lobbyGameState.coinLocations[i][1];
    let currentDirection = lobbyGameState.wanderingCoinDirections[i];
    let availableDirections = [];

    lobbyGameState.gridLayout[currentY][currentX] = 0;

    if(lobbyGameState.gridLayout[currentY - 1][currentX] == 0 ){
      availableDirections.push("up");
    }
    if(lobbyGameState.gridLayout[currentY + 1][currentX] == 0 ){
      availableDirections.push("down");
    }
    if(lobbyGameState.gridLayout[currentY][currentX + 1] == 0 ){
      availableDirections.push("right");
    }
    if(lobbyGameState.gridLayout[currentY][currentX - 1] == 0 ){
      availableDirections.push("left");
    }

    if(availableDirections.length == 1){ // If there is only one path to go
      currentDirection = availableDirections[0];
    }
    else if (availableDirections.length >= 2){ // If there are at least two paths to go
      if(currentDirection == "up"){
        availableDirections.splice(availableDirections.indexOf("down"), 1);
      }
      else if(currentDirection == "down"){
        availableDirections.splice(availableDirections.indexOf("up"), 1);
      }
      else if(currentDirection == "right"){
        availableDirections.splice(availableDirections.indexOf("left"), 1);
      }
      else if(currentDirection == "left"){
        availableDirections.splice(availableDirections.indexOf("right"), 1);
      }
      
      currentDirection = pickNewDirection(availableDirections);
    }

    if(availableDirections.length >= 1){ // Checks if coin can even move (might be trapped)
      if(currentDirection == "up"){
        currentY -= 1;
      }
      else if(currentDirection == "down"){
        currentY += 1;
      }
      else if(currentDirection == "right"){
        currentX += 1;
      }
      else if(currentDirection == "left"){
        currentX -= 1;
      }
    }

    lobbyGameState.coinLocations[i] = [currentY, currentX];
    lobbyGameState.wanderingCoinDirections[i] = currentDirection;
    lobbyGameState.gridLayout[currentY][currentX] = 2;
  }
}

module.exports = {
  gameStates,
  TILE_SIZE,
  GetRandomCoinLocation,
  GetRandomPlayerLocation,
  CreateStartingLayout,
  LoadActivatedPerks,
};
