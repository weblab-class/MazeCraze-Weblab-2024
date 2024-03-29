import React, { useRef, useEffect, useState } from "react";
// import { drawCanvas } from "../../gameLogic/CanvasManager";
// import { drawCanvas } from "../../gameLogic/CanvasManager";
import useWindowDimensions from "../../Hooks";
import SignUpMaze from "../../public/images/SignUpPageImage.svg";
import LoginMaze from "./LoginMaze.css";

// let canvas;
// let ctx;
// const gameLogic = require("../../gameLogic/GameLogic");

// const updateGlobalCanvas = (curCanvas, curCtx) => { // Get the canvas and context variables from the UseEffect and update the global variables
//     canvas = curCanvas;
//     ctx = curCtx;
// }

// const TILE_SIZE = 32; // Pixels of each tile
// const TILE_SIZE = 32; // Pixels of each tile

// const image = (fileName) => { // Load sprite files (STILL WORK IN PROGRESS)
//     const img = new Image(TILE_SIZE, TILE_SIZE);
//     img.src = `../../public/images/${fileName}`;
//     console.log(img.src);
//     return img;
// }
// // List of sprites
// let wallImage = image("wall");
// let groundImage = image("ground");
// const image = (fileName) => { // Load sprite files (STILL WORK IN PROGRESS)
//     const img = new Image(TILE_SIZE, TILE_SIZE);
//     img.src = `../../public/images/${fileName}`;
//     console.log(img.src);
//     return img;
// }
// // List of sprites
// let wallImage = image("wall");
// let groundImage = image("ground");

// const gridLayout = [
//     //29 rows and 48 columns
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,5,0,0,0,3,3,3,3,5,5,5,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,5,0,5,0,0,3,3,3,3,0,0,5,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,5,0,5,0,5,5,5,3,3,0,5,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,5,0,5,0,5,3,5,3,3,5,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,5,0,5,5,5,5,3,5,5,5,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0,3,3,3,3,0,5,5,5,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,5,0,0,0,0,3,3,3,3,0,0,0,5,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,5,5,0,5,5,5,3,0,0,5,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,5,0,0,5,3,5,3,0,5,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,5,0,0,5,5,5,5,0,5,5,5,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
// ]
// const gridLayout = [
//     //29 rows and 48 columns
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,5,0,0,0,3,3,3,3,5,5,5,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,5,0,5,0,0,3,3,3,3,0,0,5,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,5,0,5,0,5,5,5,3,3,0,5,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,5,0,5,0,5,3,5,3,3,5,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,5,0,5,5,5,5,3,5,5,5,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,0,0,0,3,3,3,3,0,5,5,5,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,5,0,0,0,0,3,3,3,3,0,0,0,5,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,5,5,0,5,5,5,3,0,0,5,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,5,0,0,5,3,5,3,0,5,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,0,5,0,0,5,5,5,5,0,5,5,5,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//     [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
// ]

const SignupMaze = ({ GoogleLoginButton }) => {
  const { height, width } = useWindowDimensions();

  // THIS IS THE MAIN FUNCTION TO DRAW A NEW MAP GIVEN A GRIDLAYOUT AND TILE SIZE
  // const UpdateMaze = (gridLayout, TILE_SIZE) => {
  //     TILE_SIZE = TILE_SIZE
  //     let ROW_SIZE = gridLayout.length; // Defines how many maze rows
  //     let COL_SIZE = gridLayout[0].length; // Defines how many maze columns
  //     canvas.height = height;
  //     canvas.width = width;
  //     console.log(gridLayout.length)
  //     console.log(gridLayout[0].length)
  //     console.log(width)
  //     console.log(height)

  //     // This runs through each tile and displays which tile type it is (wall, ground, player, etc)
  //     for(let row = 0; row < ROW_SIZE; row++){
  //         for(let col = 0; col < COL_SIZE; col++){
  //             const tile = gridLayout[row][col]; // Get a specific row and column position of tile
  //             let image = null;
  //             switch(tile) {
  //                 case 0: // Tile is ground
  //                     ctx.fillStyle="#0B1354";
  //                     image = groundImage;
  //                     break;
  //                 case 3: // Tile is wall
  //                     ctx.fillStyle="#006BE5";
  //                     image = wallImage;
  //                     break;
  //                 case 5: // Tile is wall
  //                     ctx.fillStyle="#FCCF14";
  //                     image = wallImage;
  //                     break;
  //             }

  //             // ctx.drawImage(
  //             //     image,
  //             //     col * TILE_SIZE*2,
  //             //     row * TILE_SIZE*2,
  //             //     TILE_SIZE,
  //             //     TILE_SIZE,
  //             // );
  //             ctx.fillRect(
  //                 col * TILE_SIZE,
  //                 row * TILE_SIZE,
  //                 TILE_SIZE,
  //                 TILE_SIZE
  //             )
  //         }
  //     }
  // }

  // const canvasRef = useRef(null);

  // Whenever the isLoading State changes,
  // useEffect(() => {

  //     const curCanvas = canvasRef.current;
  //     const curCtx = curCanvas.getContext('2d');
  //     updateGlobalCanvas(curCanvas, curCtx);

  //     UpdateMaze(gridLayout, TILE_SIZE);

  // }, []);

  return (
    <div className="relative flex flex-col bg-primary-bg h-screen w-screen overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <div className="bg-primary-bg absolute z-50 w-[550px] h-[70px] rounded-md flex items-center justify-center fadeOut">
          <div className="bg-primary-text absolute w-[530px] h-[50px] rounded-md flex items-center px-2">
            <div className="bg-primary-bg absolute h-[40px] w-[40px] rounded-md move-box"></div>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full bg-primary-text split-transition-left absolute z-30"> </div>
      <div className="w-1/2 h-full bg-primary-text split-transition-right absolute z-30 inset-x-1/2">
        {" "}
      </div>
      <div className="w-full h-1/2 bg-primary-text absolute split-transition-bottom z-40 inset-y-1/2">
        {" "}
      </div>
      <div className="w-full h-1/2 bg-primary-text absolute split-transition-top z-40"> </div>

      <div className="bg-primary-bg flex items-center justify-center h-screen w-screen absolute flex-row">
        <div className="h-full w-full relative overflow-hidden flex">
          <div className="h-screen bg-primary-block w-28 absolute inset-x-[47.5%]"></div>
          <div className="bg-primary-block h-28 w-screen absolute inset-y-2/3"></div>
          <div className="bg-primary-block h-28 w-[90%] absolute inset-x-[20%] inset-y-[10%]"></div>
          <div className="h-[90%] bg-primary-block w-28 absolute inset-x-[20%] inset-y-[10%]"></div>
          <div className="w-28 h-[30%] bg-primary-block absolute inset-x-[5.7%] inset-y-[25%]"></div>
          <div className="bg-primary-block w-[30%] h-[20%] absolute inset-x-[63.5%] inset-y-[36%]"></div>
          <div className="text-[#FCCF14] text-9xl select-none absolute flex items-center justify-center w-full h-full -inset-y-[3.6%] font-custom tracking-widest text-center">
            Maze
            <br />
            Craze
          </div>
        </div>
      </div>

      {/* <canvas ref={canvasRef} className="absolute"/> */}

      <div className="absolute inset-x-1/2 inset-y-3/4 transform -translate-x-20 translate-y-24">
        {GoogleLoginButton}
      </div>

      {/* <div className="absolute bg-primary-bg min-h-screen h-full w-full flex items-center justify-center z-10">

                </div> */}
    </div>
  );
};

export default SignupMaze;
