const gameLogic = require("./gameLogic/GameLogic"); // GameLogic file acess
const gameManager = require("./gameLogic/GameManager"); // GameManager file access
let io;

const userToSocketMap = {}; // maps user ID to socket object
const socketToUserMap = {}; // maps socket ID to user object

const getSocketFromUserID = (userid) => userToSocketMap[userid];
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
  if (user) delete userToSocketMap[user._id];
  delete socketToUserMap[socket.id];
};

module.exports = {
  init: (http) => {
    io = require("socket.io")(http);

    io.on("connection", (socket) => {
      console.log(`socket has connected ${socket.id}`);
      socket.on("playerRoundReady", (data) => {

        // ONCE GAME MANAGER IS ADDED AND THINGS WORK, MAKE A FUNCTION THAT ADDS TOTAL PLAYERS READY AND STARTS WHEN IT REACHES TOTAL PLAYERS IN GAME
        let [newPlayerLocation, newCoinLocations, newGridLayout] = gameManager.CreateStartingLayout();
        gameManager.playerLocation = newPlayerLocation;
        gameManager.coinLocations = newCoinLocations;
        gameManager.gridLayout = newGridLayout;
        socket.emit("roundStart", {gridLayout: gameManager.gridLayout, TILE_SIZE: gameManager.TILE_SIZE});
      })
      socket.on("move", (data) => { // Receives this when a player makes an input
        // if(gameManager.roundStarted){
          let [collectedCoin, moved] = gameLogic.MovePlayer(data.dir);
          if(collectedCoin){
            gameLogic.CollectCoin();
          }
          if(moved){ // Only update the grid if moving to a spot that's not a wall
            socket.emit("playerMoveUpdateMap", {gridLayout: gameManager.gridLayout, TILE_SIZE: gameManager.TILE_SIZE});
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

  getSocketFromUserID: getSocketFromUserID,
  getUserFromSocketID: getUserFromSocketID,
  getSocketFromSocketID: getSocketFromSocketID,
  getIo: () => io,
};
