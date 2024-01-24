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

const TILE_SIZE = 32; // Pixels of each tile
let gridLayout;
let playerLocation;
let coinLocations;
let roundCoinsCount = 5;
let roundStarted = false;

let gameState = {
  // HARD CODED IN
  playerStats: [
    {
      id: 1,
      location: [],
      roundCoins: 0,
      totalCoins: 0,
    },
  ],
  totalPlayers: 1,
  round: 1,
  activatedPerks: [],
  timeLeft: 30,
  gridLayout: [],
};

// let gameState = {
//     playerStats: Array, // Array of objects (refer to playerstats below)
//     totalPlayers: Number,
//     round: Number,
//     activatedPerks: Array,
//     timeLeft: Number,
//     gridLayout: Array,
// }

// playerStats = {
//     id: Number,
//     location: Array, [x, y],
//     roundCoins: Number,
//     totalConis: Number,
// }

const SetupGame = () => {

};

const CreateStartingLayout = () => {
  playerLocation = [];
  coinLocations = [];
  gridLayout = [];

  let mazes = [...mazeManager.mazes];
  let randomMazeSelect = Math.floor(Math.random() * mazes.length);
  gridLayout = mazes[randomMazeSelect];
  console.log("Section A");

  [playerLocationX, playerLocationY] = GetRandomPlayerLocation();
  playerLocation[0] = playerLocationX;
  playerLocation[1] = playerLocationY;
  for (let i = 0; i < roundCoinsCount; i++) {
    coinLocations.push(GetRandomCoinLocation());
  }

  gridLayout[playerLocation[0]][playerLocation[1]] = [1]; // Change depending on player
  for (let i = 0; i < coinLocations.length; i++) {
    gridLayout[coinLocations[i][0]][coinLocations[i][1]] = 2;
  }

  return [playerLocation, coinLocations, gridLayout];
};

const GetRandomPlayerLocation = () => {
  let needsLocation = true;
  while (needsLocation) {
    // Generate a random location for player
    let randomX = Math.floor(Math.random() * gridLayout.length);
    let randomY = Math.floor(Math.random() * gridLayout[0].length);
    if (gridLayout[randomX][randomY] == 0) {
      needsLocation = false;
      return [randomX, randomY];
    }
  }
};

const GetRandomCoinLocation = () => {
  let needsLocation = true;
  while (needsLocation) {
    // Generate a random location for coin
    let randomX = Math.floor(Math.random() * gridLayout.length);
    let randomY = Math.floor(Math.random() * gridLayout[0].length);
    if (gridLayout[randomX][randomY] == 0) {
      needLocation = false;
      return [randomX, randomY];
    }
  }
};

module.exports = {
  gameState,
  TILE_SIZE,
  SetupGame,
  CreateStartingLayout,
};
