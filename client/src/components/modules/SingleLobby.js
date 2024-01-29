import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../utilities.js";
import { MAX_LOBBY_SIZE } from "./constants.js";
const SingleLobby = ({ lobbyId, lobbyGameState }) => {
  const navigate = useNavigate();
  const JoiningLobby = () => {
    console.log(!lobbyGameState.in_game)
    if (lobbyGameState.in_game) {
      post("/api/lobby", {
        lobby_id: lobbyId,
      }).then(()=>{
  
      navigate(`/gamelobby/${lobbyId}`);
  
      }).catch((err) => console.log("JOINING LOBBY ERROR: " + err));
    }

    
  };
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between hover:bg-gray-300 text-black text-xl py-2 px-2 w-full ">
        <div className="flex items-center cursor-pointer">
          {Object.keys(lobbyGameState.playerStats).length <= MAX_LOBBY_SIZE ? (
            <div
              onClick={JoiningLobby}
              className="rounded-xl text-l bg-primary-block text-white px-3 py-1.5 mr-4 w-min h-min"
            >
              JOIN
            </div>
          ) : (
            <div />
          )}
          <div>
          Lobby {lobbyId}
          </div>
        </div>
        <div>
          {lobbyGameState && Object.values(lobbyGameState.playerStats).length}/{MAX_LOBBY_SIZE}
        </div>
      </div>
      <hr className=" bg-gray-200 h-0.5" />
    </div>
  );
};
export default SingleLobby;
