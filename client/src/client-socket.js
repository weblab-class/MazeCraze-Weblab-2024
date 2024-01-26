import socketIOClient from "socket.io-client";
import { post } from "./utilities";
import { UpdateMaze } from "./client-game-logic/CanvasManager";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);

let lobbyCode = "lobbyCode"; // hard coded

socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});

socket.on("playerMoveUpdateMap", (data) => {
  UpdateMaze(data.gridLayout, data.TILE_SIZE);
});

socket.on("roundStart", (data) => {
  console.log("5");
  UpdateMaze(data.gridLayout, data.TILE_SIZE);
});

// socket.on("UpdateTimer", (data) => {
//   console.log("client received timer update!")
//   UpdateTimer(data.timeLeft);
// });

export const playerReady = () => {
  // TO DO,  add player id/number?
  socket.emit("playerRoundReady", {lobbyCode : "lobbyCode"});
};

export const move = (dir) => {
  socket.emit("move", {dir: dir});
};
