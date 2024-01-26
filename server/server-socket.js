const gameLogic = require("./gameLogic/GameLogic"); // GameLogic file acess
const gameManager = require("./gameLogic/GameManager"); // GameManager file access
let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => userToSocketMap[userid];
const getUserFromSocketID = (socketid) => socketToUserMap[socketid];
const getSocketFromSocketID = (socketid) => io.sockets.connected[socketid];

const sendNewTimer = (lobbyCode) => {
  gameManager.gameStates[lobbyCode].timeLeft -= 1;
  io.to(lobbyCode).emit("UpdateTimer", {timeLeft: gameManager.gameStates[lobbyCode].timeLeft});

  if(gameManager.gameStates[lobbyCode].timeLeft <= 0){
    clearInterval(roundTimers[lobbyCode]);
    io.to(lobbyCode).emit("EndRound", {playerCoins: gameManager.gameStates[lobbyCode].playerStats[0].roundCoins}) // TO DO: MAKE IT AN ARRAY OF ROUND COINS
  }
};

const sendUpdatedMap = (newGridLayout, lobbyCode) => {
  gameManager.gameStates[lobbyCode].gridLayout = newGridLayout;
  io.to(lobbyCode).emit("playerMoveUpdateMap", {gridLayout: gameManager.gameStates[lobbyCode].gridLayout, TILE_SIZE: gameManager.TILE_SIZE});
}

let roundTimers = {};

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
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("playerRoundReady", (data) => {
        gameManager.gameStates[data.lobbyCode] = {
          // HARD CODED IN
          host: Number,
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

        console.log(gameManager.gameStates[data.lobbyCode]);

        // ONCE GAME MANAGER IS ADDED AND THINGS WORK, MAKE A FUNCTION THAT ADDS TOTAL PLAYERS READY AND STARTS WHEN IT REACHES TOTAL PLAYERS IN GAME
        let [newPlayerLocation, newCoinLocations, newGridLayout] = gameManager.CreateStartingLayout();
        console.log("1")
        gameManager.gameStates[data.lobbyCode].playerStats[0].location = newPlayerLocation;
        console.log("2")
        gameManager.gameStates[data.lobbyCode].newCoinLocations = newCoinLocations;
        console.log("3")
        gameManager.gameStates[data.lobbyCode].gridLayout = newGridLayout;

        //roundTimers[data.lobbyCode] = setInterval(sendNewTimer("lobbyCode"), 1000);
        console.log("4")
        socket.emit("roundStart", {gridLayout: gameManager.gameStates[data.lobbyCode].gridLayout, TILE_SIZE: gameManager.TILE_SIZE});
        gameManager.SetupGame();
      })
      socket.on("move", (data) => { // Receives this when a player makes an input
        // if(gameManager.roundStarted){
          let [collectedCoin, moved] = gameLogic.MovePlayer(data.dir);
          if(collectedCoin){
            gameLogic.CollectCoin();
          }
          if(moved){ // Only update the grid if moving to a spot that's not a wall
            socket.emit("playerMoveUpdateMap", {gridLayout: gameManager.gameStates[data.lobbyCode].gridLayout, TILE_SIZE: gameManager.TILE_SIZE});
          };
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
  sendUpdatedMap,

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  
  getIo: () => io,
};
