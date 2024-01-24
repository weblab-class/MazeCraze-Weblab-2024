import React from "react";




const Tutorial = () => {
  return (
    <div className="text-4xl text-primary-text font-bold bg-primary-bg w-full min-w-screen h-full min-h-screen px-4 overflow-hidden flex justify-center items-center relative font-custom tracking-widest">
        <div className=" w-full h-24 absolute top-0 flex justify-center  items-center z-50 text-7xl">
          Tutorial
        </div>
        <div className="bg-primary-block h-[500px] w-[1200px] flex absolute p-8">
          <div className="bg-primary-pink h-full w-full z-50 flex justify-center items-center text-primary-bg text-2xl p-5 text-wrap text-center">
            Welcome to Maze Craze! To play the game is simple. Use the keys specified in Customize page to navigate your character. When you become able to use perks you can press the spacebar to use them. Have fun and enjoy the chaos!
          </div>
        </div>
        <div className="bg-primary-block h-full w-20 flex absolute left-10"></div>
        <div className="bg-primary-block h-full w-20 flex absolute"></div>
        <div className="bg-primary-block h-full w-20 flex absolute right-10"></div>
        <div className="bg-primary-block h-20 w-full flex absolute "></div>
    </div>
  )
};

export default Tutorial;
