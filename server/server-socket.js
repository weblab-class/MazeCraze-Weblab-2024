const gameLogic = require("./gameLogic/GameLogic"); // GameLogic file acess
const gameManager = require("./gameLogic/GameManager"); // GameManager file access
const lobby = require("./models/lobby");
let io;

let roundTimers = {};

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => {
  return userToSocketMap[userid];
};
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

// const sendUpdatedMap = (newGridLayout, lobbyId) => {
//   gameManager.gameStates[lobbyId].gridLayout = newGridLayout;
//   io.to(lobbyId).emit("playerMoveUpdateMap", {
//     gridLayout: gameManager.gameStates[lobbyId].gridLayout,
//     TILE_SIZE: gameManager.TILE_SIZE,
//   });
// };

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
      socket.on("serverStartGameRequest", (data) => {
        io.emit("startGameForPlayers", {lobbyId: data.lobbyId});
      });
      socket.on("playerRoundReady", (data) => {

        let lobbyGameState = gameManager.gameStates[data.lobbyId];

        // ONCE GAME MANAGER IS ADDED AND THINGS WORK, MAKE A FUNCTION THAT ADDS TOTAL PLAYERS READY AND STARTS WHEN IT REACHES TOTAL PLAYERS IN GAME
        let [newPlayerLocations, newCoinLocations, newGridLayout] = gameManager.CreateStartingLayout(lobbyGameState);
        for(const userId of Object.keys(lobbyGameState.playerStats)){
          lobbyGameState.playerStats[userId].location = newPlayerLocations[userId];
        }

        lobbyGameState.coinLocations = newCoinLocations;
        lobbyGameState.gridLayout = newGridLayout;

        // ROUND TIMER 
        roundTimers[data.lobbyId] = setInterval(() => {
          lobbyGameState.timeLeft -= 1;
          socket.emit("UpdateTimer", {timeLeft: lobbyGameState.timeLeft}); // Sends to Timer.js
          console.log(lobbyGameState.timeLeft);
          if (lobbyGameState.timeLeft <= 0){
            clearInterval(roundTimers[data.lobbyId]); // Stop the timer
            lobbyGameState.timeLeft = 30; // Reset timer
            io.emit("EndRound", {playerStats: lobbyGameState.playerStats}); // Sends to Game.js
          }
        }, 1000);

        socket.emit("roundStart", { // Sends to client socket
          gridLayout: gameManager.gameStates[data.lobbyId].gridLayout,
          TILE_SIZE: gameManager.TILE_SIZE,
        });
      });
      socket.on("move", (data) => {
        // Receives this when a player makes an input
        // if(gameManager.roundStarted){
        let [collectedCoin, moved] = gameLogic.MovePlayer(data.dir, data.lobbyId, data.userId);
        if (collectedCoin) {
          gameLogic.CollectCoin(data.lobbyId, data.userId);
        }
        if (moved) {
          // Only update the grid if moving to a spot that's not a wall
          io.emit("playerMoveUpdateMap", { // Sends to client socket
            gridLayout: gameManager.gameStates[data.lobbyId].gridLayout,
            TILE_SIZE: gameManager.TILE_SIZE,
          });
        }
        // }
      });
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
      });
    });
  },

  addUser: addUser,
  removeUser: removeUser,
  // sendUpdatedMap,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,

  getIo: () => io,
};
