const gameLogic = require("./gameLogic/GameLogic"); // GameLogic file acess
const gameManager = require("./gameLogic/GameManager"); // GameManager file access
const lobby = require("./models/lobby");
let io;

// ALL GAME INTERVALS
let roundTimers = {}; // Round timer
let betweenRoundTimers = {};
let frameLoad = {}; // Interval to load frames
let playerMoveInterval = {}; 
let vanishingWallsInterval = {};
let wanderingCoinsMoveInterval = {};

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

// getSocketFromUserID(userId).emit("move")

const getSocketFromUserID = (userid) => {
  return userToSocketMap[userid];
};
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const addUser = (user, socket) => {
  const oldSocket = userToSocketMap[user._id];
  if (oldSocket && oldSocket.id !== socket.id) {
    // there was an old tab open for this user, force it to disconnect
    // FIXME: is this the behavior you want?
    oldSocket.disconnect();
    delete socketToUserMap[oldSocket.id];
  }
  userToSocketMap[user._id] = socket;
  socketToUserMap[socket.id] = user;
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
        io.emit("startGameForPlayers", {lobbyId: data.lobbyId});
      });
      socket.on("playerRoundReady", (data) => {

        // TODO : CHECK WHEN ALL PLAYERS ARE READY

        let lobbyGameState = gameManager.gameStates[data.lobbyId];
        lobbyGameState.in_round = true;
        lobbyGameState.in_game = true

        // ONCE GAME MANAGER IS ADDED AND THINGS WORK, MAKE A FUNCTION THAT ADDS TOTAL PLAYERS READY AND STARTS WHEN IT REACHES TOTAL PLAYERS IN GAME
        let [newPlayerLocations, newCoinLocations, newGridLayout] = gameManager.CreateStartingLayout(lobbyGameState);
        for(const userId of Object.keys(lobbyGameState.playerStats)){
          lobbyGameState.playerStats[userId].location = newPlayerLocations[userId];
        }

        lobbyGameState.coinLocations = newCoinLocations;
        lobbyGameState.gridLayout = newGridLayout;

        // INTERVAL TIMERS FOR HOST
        if(lobbyGameState.host_id == data.userId){
          // LOAD ALL ACTIVATED PERKS
          gameManager.LoadActivatedPerks(
            data.lobbyId, 
            vanishingWallsInterval,
            wanderingCoinsMoveInterval,
            );

          // TIMER INTERVAL
          roundTimers[data.lobbyId] = setInterval(() => {
            lobbyGameState.timeLeft -= 1;
            for(const userId of Object.keys(lobbyGameState.playerStats)){
              getSocketFromUserID(userId).emit("UpdateTimer", {timeLeft: lobbyGameState.timeLeft}); // Sends to Timer.js
            }
            if (lobbyGameState.timeLeft <= 0){
              clearInterval(roundTimers[data.lobbyId]); // Stop the timer
              lobbyGameState.timeLeft = 30; // Reset timer
              lobbyGameState.in_round = false; // No longer in round
              lobbyGameState.round += 1; // Next round

              // Reset round coins. Add to total coins.
              for(const userId of Object.keys(lobbyGameState.playerStats)){
                lobbyGameState.playerStats[userId].totalCoins += lobbyGameState.playerStats[userId].roundCoins;
                lobbyGameState.playerStats[userId].roundCoins = 0;
              }

              for(const userId of Object.keys(lobbyGameState.playerStats)){
                getSocketFromUserID(userId).emit("EndRound", {lobbyGameState: lobbyGameState}); // Sends to Timer.js
              }
            }
          }, 1000);

          // FRAME RATE INTERVAL
          frameLoad[data.lobbyId] = setInterval(() => {
            if(lobbyGameState.in_round == false){
              clearInterval(frameLoad[data.lobbyId]);
            }
            for(const userId of Object.keys(lobbyGameState.playerStats)){
              getSocketFromUserID(userId).emit("UpdateMap", {gameState: lobbyGameState, TILE_SIZE: gameManager.TILE_SIZE});
            }
          }, 1000/60);

          // PLAYER MOVE INTERVAL
          playerMoveInterval[data.lobbyId] = setInterval(() => {
            if(lobbyGameState.in_round == false){
              clearInterval(playerMoveInterval[data.lobbyId]);
            }
            for(const userId of Object.keys(lobbyGameState.playerStats)){
              gameLogic.MovePlayer(lobbyGameState, userId);
            }
          }, 1000/lobbyGameState.playerSpeed);

        }
      });
      socket.on("move", (data) => {
        if(gameManager.gameStates[data.lobbyId].in_round){
          gameLogic.UpdatePlayerDirection(data.dir, true, gameManager.gameStates[data.lobbyId], data.userId);
        }
      });
      socket.on("stopMove", (data) => {
        if(gameManager.gameStates[data.lobbyId].in_round){
          gameLogic.UpdatePlayerDirection(data.dir, false, gameManager.gameStates[data.lobbyId], data.userId);
        }
      })
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
      socket.on("removeUserFromGame", (data) => {
        delete gameManager.gameStates[data.lobbyId].playerStats[data.userId]
        players = Object.keys(gameManager.gameStates[data.lobbyId].playerStats)
        gameManager.gameStates[data.lobbyId].host_id = players[0]
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
