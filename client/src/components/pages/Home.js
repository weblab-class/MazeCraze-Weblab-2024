import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <>
      <div className="text-4xl text-primary-text font-bold bg-primary-bg w-full h-full min-h-screen px-4 py-2">
        <div className="absolute top-2 left-4">Maze Craze</div>
        <div className="flex flex-col w-full h-screen items-center justify-center">
          <div className="gap-1 flex flex-col text-left">
            {/* Eventually Change These Paragraphs into Link Componenets */}
            <Link to="/home/select-lobby">
              <p className="pb-2">Find Game</p>
            </Link>
            <p className="pb-2">Create Game</p>
            <p className="pb-2">Customize</p>
            <p className="pb-2">Tutorial</p>
            <p className="pb-2">Logout</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
