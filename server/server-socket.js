const gameLogic = require("./gameLogic/GameLogic"); // GameLogic file acess
const gameManager = require("./gameLogic/GameManager"); // GameManager file access
let io;

// ALL GAME INTERVALS
let roundTimers = {}; // Round timer
let betweenRoundTimers = {};
let frameLoad = {}; // Interval to load frames
let playerMoveInterval = {};
let vanishingWallsInterval = {};
let wanderingCoinsMoveInterval = {};
let threeBlindMiceMoveInterval = {};
// playerDeathInterval is in GameLogic.js

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => {
  return userToSocketMap[userid];
};
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const addUser = (user, socket) => {
  if (user && socket) {
    const oldSocket = userToSocketMap[user._id];
    if (oldSocket && oldSocket.id !== socket.id) {
      // there was an old tab open for this user, force it to disconnect
      // FIXME: is this the behavior you want?
      oldSocket.disconnect();
      delete socketToUserMap[oldSocket.id];
    }
    userToSocketMap[user._id] = socket;
    socketToUserMap[socket.id] = user;
  }
};

const removeUser = (user, socket) => {
  if (user) {
    delete userToSocketMap[user._id];
  }
  delete socketToUserMap[socket.id];
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      // When host starts game
      socket.on("serverStartGameRequest", (data) => {
        let lobbyGameState = gameManager.gameStates[data.lobbyId];
        if (lobbyGameState) {
          lobbyGameState.in_game = true;
          io.emit("startGameForPlayers", { lobbyGameState });
        }
      });
      socket.on("playerRoundReady", (data) => {
        // TODO : CHECK WHEN ALL PLAYERS ARE READY
        let lobbyGameState = gameManager.gameStates[data.lobbyId];

        if (lobbyGameState) {
          lobbyGameState.in_round = true;
          lobbyGameState.in_game = true;

          // ONCE GAME MANAGER IS ADDED AND THINGS WORK, MAKE A FUNCTION THAT ADDS TOTAL PLAYERS READY AND STARTS WHEN IT REACHES TOTAL PLAYERS IN GAME
          let [newPlayerLocations, newCoinLocations, newGridLayout] =
            gameManager.CreateStartingLayout(lobbyGameState);
          for (const userId of Object.keys(lobbyGameState.playerStats)) {
            lobbyGameState.playerStats[userId].location = newPlayerLocations[userId];
          }

          lobbyGameState.coinLocations = newCoinLocations;
          lobbyGameState.gridLayout = newGridLayout;

          // INTERVAL TIMERS FOR HOST
          if (lobbyGameState.host_id == data.userId) {
            // LOAD ALL ACTIVATED PERKS
            gameManager.LoadActivatedPerks(
              data.lobbyId,
              vanishingWallsInterval,
              wanderingCoinsMoveInterval,
              threeBlindMiceMoveInterval
            );

            // ROUND TIMER INTERVAL
            roundTimers[data.lobbyId] = setInterval(() => {
              lobbyGameState.timeLeft -= 1;
              for (const userId of Object.keys(lobbyGameState.playerStats)) {
                if (getSocketFromUserID(userId)) {
                  getSocketFromUserID(userId).emit("UpdateTimer", {
                    timeLeft: lobbyGameState.timeLeft,
                  }); // Sends to Timer.js
                }
              }

              // WHEN ROUND IS FINISHED
              if (lobbyGameState.timeLeft <= 0) {
                clearInterval(roundTimers[data.lobbyId]); // Stop the timer
                lobbyGameState.timeLeft = 30; // Reset timer
                lobbyGameState.in_round = false; // No longer in round
                lobbyGameState.round += 1; // Next round
                lobbyGameState.coinLocations = [];
                lobbyGameState.coinDirections = [];
                lobbyGameState.blindMiceLocations = [];
                lobbyGameState.blindMiceDirections = [];

                // Add a new perk
                let randomPerkIndex = Math.floor(
                  Math.random() * lobbyGameState.availablePerks.length
                );
                lobbyGameState.lastPerk = lobbyGameState.availablePerks[randomPerkIndex];
                lobbyGameState.activatedPerks.push(lobbyGameState.availablePerks[randomPerkIndex]);
                lobbyGameState.availablePerks.splice(randomPerkIndex, 1);

                // Reset round coins, player movement, and location
                for (const userId of Object.keys(lobbyGameState.playerStats)) {
                  let player = lobbyGameState.playerStats[userId];
                  player.roundCoins = 0;
                  player.isMoving.up = false;
                  player.isMoving.down = false;
                  player.isMoving.right = false;
                  player.isMoving.left = false;
                  player.lastMoveDirection = "";
                }

                for (const userId of Object.keys(lobbyGameState.playerStats)) {
                  if (getSocketFromUserID(userId)) {
                    getSocketFromUserID(userId).emit("EndRound", { lobbyGameState }); // Sends to Timer.js
                  }
                }
              }
            }, 1000);

            // BETWEEN ROUNDS TIMER INTERVAL
            betweenRoundTimers[data.lobbyId] = setInterval(() => {
              lobbyGameState.betweenRoundTimeLeft -= 1;
              for (const userId of Object.keys(lobbyGameState.playerStats)) {
                if (getSocketFromUserID(userId)) {
                  getSocketFromUserID(userId).emit("UpdateBetweenRoundTimer", {
                    timeLeft: lobbyGameState.betweenRoundTimeLeft,
                  }); // Sends to BetweenRound.js to Update Timer
                }
              }
              if (lobbyGameState.betweenRoundTimeLeft <= 0) {
                clearInterval(betweenRoundTimers[data.lobbyId]); // Stop the timer
                lobbyGameState.betweenRoundTimeLeft = 40; // Reset timer
                lobbyGameState.in_round = true; // Starting new round

                for (const userId of Object.keys(lobbyGameState.playerStats)) {
                  if (getSocketFromUserID(userId)) {
                    getSocketFromUserID(userId).emit("EndRound", { lobbyGameState }); // Sends to Game.js
                  }
                }
              }
            }, 1000);

            // FRAME RATE INTERVAL
            frameLoad[data.lobbyId] = setInterval(() => {
              if (lobbyGameState.in_round == false) {
                clearInterval(frameLoad[data.lobbyId]);
              }
              for (const userId of Object.keys(lobbyGameState.playerStats)) {
                if (getSocketFromUserID(userId)) {
                  getSocketFromUserID(userId).emit("UpdateMap", {
                    gameState: lobbyGameState,
                    TILE_SIZE: gameManager.TILE_SIZE,
                    userId: userId,
                  });
                }
              }
            }, 1000 / 60);

            // PLAYER MOVE INTERVAL
            playerMoveInterval[data.lobbyId] = setInterval(() => {
              if (lobbyGameState.in_round == false) {
                clearInterval(playerMoveInterval[data.lobbyId]);
              }
              for (const userId of Object.keys(lobbyGameState.playerStats)) {
                gameLogic.MovePlayer(lobbyGameState, userId);
              }
            }, 1000 / lobbyGameState.playerSpeed);
          }
        }
      });
      // When move key is down
      socket.on("move", (data) => {
        if (gameManager.gameStates[data.lobbyId] && gameManager.gameStates[data.lobbyId].in_round) {
          gameLogic.UpdatePlayerDirection(
            data.dir,
            true,
            gameManager.gameStates[data.lobbyId],
            data.userId
          );
        }
      });
      socket.on("stopMove", (data) => {
        if (gameManager.gameStates[data.lobbyId] && gameManager.gameStates[data.lobbyId].in_round) {
          gameLogic.UpdatePlayerDirection(
            data.dir,
            false,
            gameManager.gameStates[data.lobbyId],
            data.userId
          );
        }
      });
      socket.on("enteredChatMessage", (data) => {
        let lobbyGameState = gameManager.gameStates[data.lobbyId];
        for (const userId of Object.keys(lobbyGameState.playerStats)) {
          if (getSocketFromUserID(userId)) {
            if (lobbyGameState) {
              if (lobbyGameState.playerStats) {
                getSocketFromUserID(userId).emit("displayNewMessage", {
                  name: lobbyGameState.playerStats[data.userId].name,
                  message: data.message,
                });
              }
            }
          }
        }
      });
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
      socket.on("removeUserFromGame", (data) => {
        if (gameManager.gameStates) {
          if (gameManager.gameStates[data.lobbyId]) {
            delete gameManager.gameStates[data.lobbyId].playerStats[data.userId];
            players = Object.keys(gameManager.gameStates[data.lobbyId].playerStats);
            gameManager.gameStates[data.lobbyId].host_id = players[0];
            if (!gameManager.gameStates[data.lobbyId].host_id) {
              // if host doesn't exist, delete gameState
              delete gameManager.gameStates[data.lobbyId];
            }
          }
        }
      });
      socket.on("updateInGame", (data) => {
        io.emit("updateInGameToPlayers", { lobbyId: data.lobbyId });
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,

  getIo: () => io,
};
