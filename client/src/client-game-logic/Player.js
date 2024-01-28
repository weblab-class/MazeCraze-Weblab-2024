import { move, stopMove } from "../client-socket";

/** Callback function that calls correct movement from key */
export const handleDownInput = (e) => {

  if (e.key === "ArrowUp") {
    move("up");
  }
  if (e.key === "ArrowDown") {
    move("down");
  }
  if (e.key === "ArrowLeft") {
    move("left");
  }
  if (e.key === "ArrowRight") {
    move("right");
  }
};

export const handleUpInput = (e) => {

  if (e.key === "ArrowUp") {
    stopMove("up");
  }
  if (e.key === "ArrowDown") {
    stopMove("down");
  }
  if (e.key === "ArrowLeft") {
    stopMove("left");
  }
  if (e.key === "ArrowRight") {
    stopMove("right");
  }
};

