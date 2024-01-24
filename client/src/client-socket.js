import socketIOClient from "socket.io-client";
import { post } from "./utilities";
import { UpdateMaze } from "./client-game-logic/CanvasManager";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});

socket.on("playerMoveUpdateMap", (data) => {
  // playerLocation[0] = data.playerLocation[0];
  // playerLocation[1] = data.playerLocation[1];
  // for(let i = 0; i < gridLayout.length; i++){
  //   for(let j = 0; j < gridLayout[0].length; j++){
  //     gridLayout[i][j] = data.gridLayout[i][j];
  //   }
  // }
  console.log(data.gridLayout);
  UpdateMaze(data.gridLayout, data.TILE_SIZE);
});

socket.on("roundStart", (data) => {
  console.log("CLIENT RECEIVED ROUND START");
  UpdateMaze(data.gridLayout, data.TILE_SIZE);
});

export const playerReady = () => {
  // TO DO,  add player id/number?
  socket.emit("playerRoundReady");
};

export const move = (dir) => {
  socket.emit("move", { dir: dir });
};
