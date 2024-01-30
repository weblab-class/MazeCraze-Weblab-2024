import { move, stopMove } from "../client-socket";

/** Callback function that calls correct movement from key */
export const handleDownInput = (e, keybinds) => {

  if (e.key === keybinds.up) {
    move("up");
  }
  if (e.key === keybinds.down) {
    move("down");
  }
  if (e.key === keybinds.left) {
    move("left");
  }
  if (e.key === keybinds.right) {
    move("right");
  }
};

export const handleUpInput = (e, keybinds) => {

  if (e.key === keybinds.up) {
    stopMove("up");
  }
  if (e.key === keybinds.down) {
    stopMove("down");
  }
  if (e.key === keybinds.left) {
    stopMove("left");
  }
  if (e.key === keybinds.right) {
    stopMove("right");
  }
};

