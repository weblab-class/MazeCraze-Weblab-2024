import socketIOClient from "socket.io-client";
import { post } from "./utilities";
import { UpdateMaze } from "./client-game-logic/CanvasManager";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);

let globalUserId;
let globalLobbyId;

socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id }).catch((err)=> console.log("There was an error initializing the socket", err));
});

socket.on("UpdateMap", (data) => {
  UpdateMaze(data.gameState, data.TILE_SIZE, data.userId);
});

// socket.on("UpdateTimer", (data) => {
//   console.log("client received timer update!")
//   UpdateTimer(data.timeLeft);
// });

export const playerReady = (lobbyId, userId) => {
  globalUserId = userId;
  globalLobbyId = lobbyId;
  socket.emit("playerRoundReady", {lobbyId : lobbyId, userId: userId});
};

export const move = (dir) => {
  socket.emit("move", { dir: dir, lobbyId: globalLobbyId, userId: globalUserId});
};

export const stopMove = (dir) => {
  socket.emit("stopMove", {dir: dir, lobbyId: globalLobbyId, userId: globalUserId});
}
