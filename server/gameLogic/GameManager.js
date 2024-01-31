// 0 - ground
// 1 - wall
// 2 - coin
// 3 - One "Three Blind Mice"
// [userId] - Player

const mazeManager = require("./MazeManager");
let playerDeathTimer = {};

const TILE_SIZE = 24; // Pixels of each tile
let roundCoinsCount = 5;

let gameStates = {};

const CreateStartingLayout = (lobbyGameState) => {
  let startingPlayerLocations = {};
  let startingCoinLocations = [];
  let startingGridLayout = [];

  let mazes = JSON.parse(JSON.stringify(mazeManager.mazes));

  let randomMazeSelect = Math.floor(Math.random() * mazes.length);
  startingGridLayout = mazes[randomMazeSelect];

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
      needsLocation = false;
      return [randomY, randomX];
    }
  }
};

const GetRandomMiceLocation = (gridLayout) => {
  let needsLocation = true;
  while (needsLocation) {
    // Generate a random location for mice
    let randomY = Math.floor(Math.random() * gridLayout.length);
    let randomX = Math.floor(Math.random() * gridLayout[0].length);
    if (gridLayout[randomY][randomX] == 0) {
      needsLocation = false;
      return [randomY, randomX];
    }
  }
};

const CheckEnoughCoins = (lobbyGameState) => {

  let coinCount = 0;
  for(let row = 0; row < lobbyGameState.gridLayout.length; row++){
    for(let col = 0; col < lobbyGameState.gridLayout[0].length; col++){
      if(lobbyGameState.gridLayout[row][col] == 2){
        coinCount += 1;
      }
    }
  }
  for(let i = 0; i < (roundCoinsCount - coinCount); i++){
    let [coinLocationY, coinLocationX] = GetRandomCoinLocation(lobbyGameState.gridLayout);
    lobbyGameState.gridLayout[coinLocationY][coinLocationX] = 2;

    lobbyGameState.coinLocations.push([coinLocationY, coinLocationX]);
    lobbyGameState.wanderingCoinDirections.push(null);
  }
}

// LOADS ACTIVATED PERKS AT THE START OF THE ROUND
const LoadActivatedPerks = (lobbyId, crumblingWallsInterval, wanderingCoinsMoveInterval, threeBlindMiceMoveInterval) => {
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
      lobbyGameState.playerSpeed = 12;
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
            lobbyGameState.wanderingCoinDirections[i] = GenerateNewDirection();
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
    
    // SOCIAL DISTANCING PERK
    else if(perk == "Social Distancing"){
      lobbyGameState.socialDistancing = true;
    }

    // MAZE HAZE PERK
    else if(perk == "Maze Haze"){
      lobbyGameState.hasMazeHaze = true;
    }

    // THREE BLIND MICE PERK
    else if(perk == "Three Blind Mice"){
      for(let i = 0; i < 3; i++){
        lobbyGameState.blindMiceLocations.push(GetRandomMiceLocation(lobbyGameState.gridLayout));
        lobbyGameState.gridLayout[lobbyGameState.blindMiceLocations[i][0]][lobbyGameState.blindMiceLocations[i][1]] = 3;
        lobbyGameState.blindMiceDirections[i] = GenerateNewDirection();
      }
      threeBlindMiceMoveInterval[lobbyId] = setInterval(() => {
        if(lobbyGameState.in_round){
          MoveBlindMice(lobbyGameState);
        }
        else{
          clearInterval(threeBlindMiceMoveInterval[lobbyId]);
        }
      }, 500) // CURRENTLY MOVES COINS EVERY SECOND
    }

    // WHO'S WHO PERK
    else if(perk == "Who's Who"){
      lobbyGameState.unknownSprites = true;
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

const GenerateNewDirection = () => {
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

const MoveBlindMice = (lobbyGameState) => {

  const pickNewDirection = (availableDirections) => {
    let randomDirectionGenerator = Math.floor(Math.random() * availableDirections.length);
    return availableDirections[randomDirectionGenerator];
  }

  for(let i = 0; i < lobbyGameState.blindMiceLocations.length; i++){
    let currentY = lobbyGameState.blindMiceLocations[i][0]; // Gets specific coin location
    let currentX = lobbyGameState.blindMiceLocations[i][1];
    let currentDirection = lobbyGameState.blindMiceDirections[i];
    let availableDirections = [];

    lobbyGameState.gridLayout[currentY][currentX] = 0;

    if(lobbyGameState.gridLayout[currentY - 1][currentX] == 0 ){
      availableDirections.push("up");
    } 
    else if (lobbyGameState.gridLayout[currentY - 1][currentX].constructor === Array){
      KillPlayer(lobbyGameState.gridLayout[currentY - 1][currentX][0], lobbyGameState);
      availableDirections.push("up");
    }
    if(lobbyGameState.gridLayout[currentY + 1][currentX] == 0 ){
      availableDirections.push("down");
    }
    else if (lobbyGameState.gridLayout[currentY + 1][currentX].constructor === Array){
      KillPlayer(lobbyGameState.gridLayout[currentY + 1][currentX][0], lobbyGameState);
      availableDirections.push("down");
    }
    if(lobbyGameState.gridLayout[currentY][currentX + 1] == 0 ){
      availableDirections.push("right");
    }
    else if (lobbyGameState.gridLayout[currentY][currentX + 1].constructor === Array){
      KillPlayer(lobbyGameState.gridLayout[currentY][currentX + 1][0], lobbyGameState);
      availableDirections.push("right");
    }
    if(lobbyGameState.gridLayout[currentY][currentX - 1] == 0 ){
      availableDirections.push("left");
    }
    else if (lobbyGameState.gridLayout[currentY][currentX - 1].constructor === Array){
      KillPlayer(lobbyGameState.gridLayout[currentY][currentX - 1][0], lobbyGameState);
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

    lobbyGameState.blindMiceLocations[i] = [currentY, currentX];
    lobbyGameState.blindMiceDirections[i] = currentDirection;

    if(currentDirection == "up"){
      lobbyGameState.gridLayout[currentY][currentX] = 31; // Up sprite
    }
    else if(currentDirection == "right"){
      lobbyGameState.gridLayout[currentY][currentX] = 32; // Right sprite
    }
    else if(currentDirection == "down"){
      lobbyGameState.gridLayout[currentY][currentX] = 33; // Down sprite
    }
    else{
      lobbyGameState.gridLayout[currentY][currentX] = 34; // Left sprite
    }
  }
}

// COPIED FROM GAMELOGIC.JS
const KillPlayer = (userId, lobbyGameState) => {
  lobbyGameState.playerStats[userId].isAlive = false;

  playerDeathTimer[userId] = setInterval(() => {
    lobbyGameState.playerStats[userId].deathCountdown -= 1;
    if (lobbyGameState.playerStats[userId].deathCountdown <= 0) {
      clearInterval(playerDeathTimer[userId]);
      lobbyGameState.playerStats[userId].isAlive = true;
      lobbyGameState.playerStats[userId].deathCountdown = 3;
      let [playerLocationY, playerLocationX] = GetRandomPlayerLocation(lobbyGameState.gridLayout);
      lobbyGameState.playerStats[userId].location = [playerLocationY, playerLocationX];
      lobbyGameState.gridLayout[playerLocationY][playerLocationX] = [userId];
    }
  }, 1000);
};

module.exports = {
  gameStates,
  TILE_SIZE,
  playerDeathTimer,
  CheckEnoughCoins,
  GetRandomCoinLocation,
  GetRandomPlayerLocation,
  CreateStartingLayout,
  LoadActivatedPerks,
};
