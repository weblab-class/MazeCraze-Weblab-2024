import { move } from "../client-socket";
import { gridLayout, playerLocation } from "./GameManager";

let movingUp = false;
let movingDown = false;
let movingRight = false;
let movingLeft = false;

const UpdateMovement = () => {
  if (movingUp){
    move("up", playerLocation, gridLayout);
  }
  if (movingDown){
    move("down", playerLocation, gridLayout);
  }
  if (movingRight){
    move("right", playerLocation, gridLayout);
  }
  if (movingLeft){
    move("left", playerLocation, gridLayout);
  }
}

const moveInterval = setInterval(UpdateMovement, 125);

/** Callback function that calls correct movement from key */
export const handleDownInput = (e) => {

  if (e.key === "ArrowUp") {
    movingUp = true;
  }
  if (e.key === "ArrowDown") {
    movingDown = true;
  }
  if (e.key === "ArrowLeft") {
    movingLeft = true;
  }
  if (e.key === "ArrowRight") {
    movingRight = true;
  }
};

export const handleUpInput = (e) => {

  if (e.key === "ArrowUp") {
    movingUp = false;
  }
  if (e.key === "ArrowDown") {
    movingDown = false;
  }
  if (e.key === "ArrowLeft") {
    movingLeft = false;
  }
  if (e.key === "ArrowRight") {
    movingRight = false;
  }
};

