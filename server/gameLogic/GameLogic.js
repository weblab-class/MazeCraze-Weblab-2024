const gameManager = require("./GameManager");

const CollectCoin = (lobbyGameState, userId, collectedCoinLocation) => {
  lobbyGameState.playerStats[userId].roundCoins += 1;
  lobbyGameState.playerStats[userId].totalCoins += 1;
  for (let i = 0; i < lobbyGameState.coinLocations.length; i++) {
    if (
      lobbyGameState.coinLocations[i][0] == collectedCoinLocation[0] &&
      lobbyGameState.coinLocations[i][1] == collectedCoinLocation[1]
    ) {
      lobbyGameState.coinLocations.splice(i, 1);
      lobbyGameState.wanderingCoinDirections.splice(i, 1);
    }
  }
  let [coinLocationY, coinLocationX] = gameManager.GetRandomCoinLocation(lobbyGameState.gridLayout);
  lobbyGameState.gridLayout[coinLocationY][coinLocationX] = 2;

  lobbyGameState.coinLocations.push([coinLocationY, coinLocationX]);
  lobbyGameState.wanderingCoinDirections.push(null);

  // SPAWNS ANOTHER COIN IF HYDRA COINS PERK IS ACTIVATED
  // These calculations are so that another coin spawns every 2*totalPlayers coins are collected
  if (lobbyGameState.hasHydraCoins) {
    let totalRoundCoinsCollected = 0;
    for (const userId of Object.keys(lobbyGameState.playerStats)) {
      totalRoundCoinsCollected += lobbyGameState.playerStats[userId].roundCoins;
    }
    if (totalRoundCoinsCollected % (lobbyGameState.totalPlayers * 2) == 0) {
      [coinLocationY, coinLocationX] = gameManager.GetRandomCoinLocation(lobbyGameState.gridLayout);
      lobbyGameState.gridLayout[coinLocationY][coinLocationX] = 2;

      lobbyGameState.coinLocations.push([coinLocationY, coinLocationX]);
      lobbyGameState.wanderingCoinDirections.push(null);
    }
  }

  gameManager.CheckEnoughCoins(lobbyGameState); // Check if there is at least 5 coins 
};

const UpdatePlayerDirection = (dir, isMoving, lobbyGameState, userId) => {
  if (dir == "up") {
    if(lobbyGameState.playerStats[userId]) {

      if (isMoving) {
        lobbyGameState.playerStats[userId].isMoving.up = true;
      } else {
        lobbyGameState.playerStats[userId].isMoving.up = false;
      }
    }
  }
  if (dir == "down") {
    if(lobbyGameState.playerStats[userId]) {

      if (isMoving) {
        lobbyGameState.playerStats[userId].isMoving.down = true;
      } else {
        lobbyGameState.playerStats[userId].isMoving.down = false;
      }
    }
  }
  if (dir == "right") {
    if(lobbyGameState.playerStats[userId]) {

      if (isMoving) {
        lobbyGameState.playerStats[userId].isMoving.right = true;
      } else {
        lobbyGameState.playerStats[userId].isMoving.right = false;
      }
    }
  }
  if (dir == "left") {
    if(lobbyGameState.playerStats[userId]) {

      if (isMoving) {
        lobbyGameState.playerStats[userId].isMoving.left = true;
      } else {
        lobbyGameState.playerStats[userId].isMoving.left = false;
      }
    }
  }
};

const MovePlayer = (lobbyGameState, userId) => {
  let gridLayout = lobbyGameState.gridLayout;
  let currentPlayerLocation = lobbyGameState.playerStats[userId].location;
  let playersGettingKilled = [];

  gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1]] = 0;
  let movedVertically = 0; // movedVertically is to prevent a coin getting skipped if player moves diagonally
  let futurePlayerLocation;
  let collectedCoinMovingVertically = false; // Sometimes coin would not be registered when moving vertically and horizontally

  if (lobbyGameState.playerStats[userId].isAlive == true) {
    // CAN ONLY MOVE PLAYER IF THEY ARE ALIVE
    if (lobbyGameState.playerStats[userId].isMoving.up) {
      futurePlayerLocation = gridLayout[currentPlayerLocation[0] - 1][currentPlayerLocation[1]];
      if (futurePlayerLocation == 0 || futurePlayerLocation == 2) {
        // If next location is not a wall, move player's location there
        currentPlayerLocation[0] -= 1;
        movedVertically += 1;
        lobbyGameState.playerStats[userId].lastMoveDirection = "up";
        if (futurePlayerLocation == 2) {
          // Check if the next location has a coin
          CollectCoin(lobbyGameState, userId, currentPlayerLocation);
          collectedCoinMovingVertically = true;
        }
      } else if (futurePlayerLocation.constructor === Array && lobbyGameState.socialDistancing) {
        playersGettingKilled.push(userId); // Adds current player to kill
        playersGettingKilled.push(futurePlayerLocation[0]);
      } else if (futurePlayerLocation == 3){ // If three blind mice
        playersGettingKilled.push(userId); // Adds current player to kill
      }
    }
    if (lobbyGameState.playerStats[userId].isMoving.down) {
      futurePlayerLocation = gridLayout[currentPlayerLocation[0] + 1][currentPlayerLocation[1]];
      if (futurePlayerLocation == 0 || futurePlayerLocation == 2) {
        // If next location is not a wall, move player's location there
        currentPlayerLocation[0] += 1;
        movedVertically -= 1;
        lobbyGameState.playerStats[userId].lastMoveDirection = "down";
        if (futurePlayerLocation == 2) {
          // Check if the next location has a coin
          CollectCoin(lobbyGameState, userId, currentPlayerLocation);
          collectedCoinMovingVertically = true;
        }
      } else if (futurePlayerLocation.constructor === Array && lobbyGameState.socialDistancing) {
        playersGettingKilled.push(userId); // Adds current player to kill
        playersGettingKilled.push(futurePlayerLocation[0]);
      } else if (futurePlayerLocation == 3){ // If three blind mice
        playersGettingKilled.push(userId); // Adds current player to kill
      }
    }
    if (lobbyGameState.playerStats[userId].isMoving.right) {
      futurePlayerLocation = gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1] + 1];
      if (futurePlayerLocation == 0 || futurePlayerLocation == 2) {
        // If next location is not a wall, move player's location there
        currentPlayerLocation[1] += 1;
        lobbyGameState.playerStats[userId].lastMoveDirection = "right";
        if (movedVertically != 0) {
          if (gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1] - 1] == 2) {
            gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1] - 1] = 0;
            if(!collectedCoinMovingVertically){ // TO COLLECT COIN
              CollectCoin(lobbyGameState, userId, currentPlayerLocation);
            }
          }
        } else {
          if (futurePlayerLocation == 2) {
            // Check if the next location has a coin
            CollectCoin(lobbyGameState, userId, currentPlayerLocation);
          }
        }
      } else if (futurePlayerLocation.constructor === Array && lobbyGameState.socialDistancing) {
        playersGettingKilled.push(userId); // Adds current player to kill
        playersGettingKilled.push(futurePlayerLocation[0]);
      } else if (futurePlayerLocation == 3){ // If three blind mice
        playersGettingKilled.push(userId); // Adds current player to kill
      }
    }
    if (lobbyGameState.playerStats[userId].isMoving.left) {
      futurePlayerLocation = gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1] - 1];
      if (futurePlayerLocation == 0 || futurePlayerLocation == 2) {
        currentPlayerLocation[1] -= 1;
        lobbyGameState.playerStats[userId].lastMoveDirection = "left";
        if (movedVertically != 0) {
          if (gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1] + 1] == 2) {
            gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1] + 1] = 0;
            if(!collectedCoinMovingVertically){ // TO COLLECT COIN
              CollectCoin(lobbyGameState, userId, currentPlayerLocation);
            }
          }
        } else {
          if (futurePlayerLocation == 2) {
            // Check if the next location has a coin
            CollectCoin(lobbyGameState, userId, currentPlayerLocation);
          }
        }
      } else if (futurePlayerLocation.constructor === Array && lobbyGameState.socialDistancing) {
        playersGettingKilled.push(userId); // Adds current player to kill
        playersGettingKilled.push(futurePlayerLocation[0]); // Gets userId of player getting interacted with (also getting killed)
      } else if (futurePlayerLocation == 3){ // If three blind mice
        playersGettingKilled.push(userId); // Adds current player to kill
      }
    }

    if (playersGettingKilled.length == 0) {
      // No players died in this movement
      gridLayout[currentPlayerLocation[0]][currentPlayerLocation[1]] = [userId];
    } else {
        for(let i = 0; i < playersGettingKilled.length; i++){
            KillPlayer(playersGettingKilled[i], lobbyGameState);
        }
    }
  }
};

const KillPlayer = (userId, lobbyGameState) => {
  lobbyGameState.playerStats[userId].isAlive = false;

  gameManager.playerDeathTimer[userId] = setInterval(() => {
    lobbyGameState.playerStats[userId].deathCountdown -= 1;
    if (lobbyGameState.playerStats[userId].deathCountdown <= 0) {
      clearInterval(gameManager.playerDeathTimer[userId]);
      lobbyGameState.playerStats[userId].isAlive = true;
      lobbyGameState.playerStats[userId].deathCountdown = 3;
      let [playerLocationY, playerLocationX] = gameManager.GetRandomPlayerLocation(
        lobbyGameState.gridLayout
      );
      lobbyGameState.playerStats[userId].location = [playerLocationY, playerLocationX];
      lobbyGameState.gridLayout[playerLocationY][playerLocationX] = [userId];
    }
  }, 1000);
};

module.exports = {
  MovePlayer,
  UpdatePlayerDirection,
};
