import CrumblingWall from "../../../dist/perkPictures/Crumbling_wall.png";
import Hermes from "../../../dist/perkPictures/Hermes_Boots.png";
import Hydra from "../../../dist/perkPictures/Hydra.png";
import MazeHaze from "../../../dist/perkPictures/Maze_Haze.png";
import ThreeBlindMice from "../../../dist/perkPictures/Three_Blind_Mice.png";
import WanderingCoins from "../../../dist/perkPictures/Wandering_Coins.png";
import SocialDistancing from "../../../dist/perkPictures/Social_Distancing.png";
import WhosWho from "../../../dist/perkPictures/Who'sWho.png"

export const perkMap = [
  {
    name: "Crumbling Walls",
    src: CrumblingWall,
    description: "Removes one wall every second",
  },
  {
    name: "Hydra Coins",
    src: Hydra,
    description: "Possibility of additional coins spawning after a user collects a coin",
  },
  {
    name: "Hermes Boots",
    src: Hermes,
    description: "Increases player movement speed",
  },
  {
    name: "Maze Haze",
    src: MazeHaze,
    description: "Limits player field of view",
  },
  {
    name: "Social Distancing",
    src: SocialDistancing,
    description: "Causes players to die when in contact with another player and respawns them in 3 seconds",
  },
  {
    name: "Three Blind Mice",
    src: ThreeBlindMice,
    description: "Spawns three mices that will chase players and kill them on contact",
  },
  {
    name: "Wandering Coins",
    src: WanderingCoins,
    description: "All coins on map begin moving",
  },
  {
    name: "Who's Who",
    src: WhosWho,
    description: "Converts everyone to an identical figure"
  }
];

let perkDict = {};
for (const perkObject of perkMap) {
    perkDict[perkObject.name] = perkObject;
}

export default perkDict;

export const MAX_LOBBY_SIZE = 5;

export const player_colors = ["#000000", "#000000", "#000000", "#000000", "#000000"];

export const round_time = 30;
export const between_round_time = round_time + 10;
export const max_rounds = 5;
