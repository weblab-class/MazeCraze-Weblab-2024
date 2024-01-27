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
    [playerLocationX, playerLocationY] = GetRandomPlayerLocation(startingGridLayout);
    startingPlayerLocations[userId] = [playerLocationX, playerLocationY];
    startingGridLayout[playerLocationX][playerLocationY] = [1]
  }

  for (let i = 0; i < roundCoinsCount; i++) {
    startingCoinLocations.push(GetRandomCoinLocation(startingGridLayout));
    startingGridLayout[startingCoinLocations[i][0]][startingCoinLocations[i][1]] = 2
  }

  return [startingPlayerLocations, startingCoinLocations, startingGridLayout];
};

const GetRandomPlayerLocation = (gridLayout) => {
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

const GetRandomCoinLocation = (gridLayout) => {
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
  gameStates,
  TILE_SIZE,
  GetRandomCoinLocation,
  CreateStartingLayout,
};
