const gameLogic = require("./gameLogic/GameLogic"); // GameLogic file acess
const gameManager = require("./gameLogic/GameManager"); // GameManager file access
const lobby = require("./models/lobby");
let io;

let roundTimers = {}; // Round timer
let frameLoad = {}; // Interval to load frames

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

        // ONCE GAME MANAGER IS ADDED AND THINGS WORK, MAKE A FUNCTION THAT ADDS TOTAL PLAYERS READY AND STARTS WHEN IT REACHES TOTAL PLAYERS IN GAME
        let [newPlayerLocations, newCoinLocations, newGridLayout] = gameManager.CreateStartingLayout(lobbyGameState);
        for(const userId of Object.keys(lobbyGameState.playerStats)){
          lobbyGameState.playerStats[userId].location = newPlayerLocations[userId];
        }

        lobbyGameState.coinLocations = newCoinLocations;
        lobbyGameState.gridLayout = newGridLayout;

        // INTERVAL TIMERS FOR HOST
        console.log("CHECKING IF USER IS HOST")
        console.log(lobbyGameState.host_id)
        console.log(data.userId)
        if(lobbyGameState.host_id == data.userId){
          console.log("THEY ARE THE HOST")
          // TIMER INTERVAL
          roundTimers[data.lobbyId] = setInterval(() => {
            lobbyGameState.timeLeft -= 1;
            socket.emit("UpdateTimer", {timeLeft: lobbyGameState.timeLeft}); // Sends to Timer.js
            if (lobbyGameState.timeLeft <= 0){
              clearInterval(roundTimers[data.lobbyId]); // Stop the timer
              lobbyGameState.timeLeft = 30; // Reset timer
              io.emit("EndRound", lobbyGameState); // Sends to Game.js
            }
          }, 1000);

          // FRAME RATE INTERVAL
          frameLoad[data.lobbyId] = setInterval(() => {
            for(const userId of Object.keys(lobbyGameState.playerStats)){
              getSocketFromUserID(userId).emit("UpdateMap", {gameState: lobbyGameState, TILE_SIZE: gameManager.TILE_SIZE});
            }
            if(lobbyGameState.timeLeft <= 0){
              clearInterval(frameLoad[data.lobbyId]);
            }
          }, 1000/60);

        }
      });
      socket.on("move", (data) => {
        gameLogic.MovePlayer(data.dir, data.lobbyId, data.userId);
      });
      socket.on("disconnect", (reason) => {
        const user = getUserFromSocketID(socket.id);
        removeUser(user, socket);
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
