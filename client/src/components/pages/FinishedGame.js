import React, { useState, useEffect } from "react";
import { socket } from "../../client-socket";
import { Link } from "react-router-dom";
const FinishedGame = ({ lobbyGameState }) => {
  return (
    <div className="font-custom tracking-widest flex bg-primary-bg w-full h-full min-h-screen items-center justify-center">
      GOOD GAME Mother...
      <Link to='/' className='text-5xl text-primary-text'>
         RETURN BACK TO MAIN MENU
      </Link>
    </div>
  );
};

export default FinishedGame;
