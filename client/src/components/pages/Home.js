import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <>
      <div className="text-4xl text-primary-text font-bold bg-primary-bg w-full h-full min-h-screen px-4 py-2">
        <div className="absolute top-2 left-4">Maze Craze</div>
        <div className="flex flex-col w-full h-screen items-center justify-center">
          <div className="gap-3 flex flex-col text-lef">
            {/* Eventually Change These Paragraphs into Link Componenets */}

            <p>Find Game</p>
            <p>Customize</p>
            <p>Tutorial</p>
            <p>Logout</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
