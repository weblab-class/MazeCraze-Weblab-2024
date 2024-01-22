import { move } from "../client-socket";
import { gridLayout, playerLocation } from "./GameManager";

/** Callback function that calls correct movement from key */
export const handleInput = (e) => {
  if (e.key === "ArrowUp") {
    move("up", playerLocation, gridLayout);
  } else if (e.key === "ArrowDown") {
    move("down", playerLocation, gridLayout);
  } else if (e.key === "ArrowLeft") {
    move("left", playerLocation, gridLayout);
  } else if (e.key === "ArrowRight") {
    move("right", playerLocation, gridLayout);
  }
};