import socketIOClient from "socket.io-client";
import { post } from "./utilities";
import { UpdateMaze } from "./gameLogic/CanvasManager";
import { TILE_SIZE, gridLayout, playerLocation } from "./gameLogic/GameManager";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});

socket.on("updateMap", (data) => {
  playerLocation[0] = data.playerLocation[0];
  playerLocation[1] = data.playerLocation[1];
  for(let i = 0; i < gridLayout.length; i++){
    for(let j = 0; j < gridLayout[0].length; j++){
      gridLayout[i][j] = data.gridLayout[i][j];
    }
  }
  UpdateMaze(gridLayout, TILE_SIZE);
})


export const move = (dir, playerLocation, gridLayout) => {
  socket.emit("move", {dir: dir, playerLocation: playerLocation, gridLayout: gridLayout});
};