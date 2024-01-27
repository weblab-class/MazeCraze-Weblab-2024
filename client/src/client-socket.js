import socketIOClient from "socket.io-client";
import { post } from "./utilities";
import { UpdateMaze } from "./client-game-logic/CanvasManager";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);

let globalUserId;
let globalLobbyId;

socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});

socket.on("UpdateMap", (data) => {
  UpdateMaze(data.gameState.gridLayout, data.TILE_SIZE);
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
