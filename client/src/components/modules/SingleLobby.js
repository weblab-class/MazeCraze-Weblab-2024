import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../../utilities.js";
import { MAX_LOBBY_SIZE } from "./constants.js";
const SingleLobby = ({ lobbyId, lobbyGameState }) => {
  const JoiningLobby = () => {
    post("/api/lobby", {
      lobby_id: lobbyId,
    }).catch((err) => console.log("JOINING LOBBY ERROR: " + err));
  };
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between hover:bg-gray-300 text-black text-xl py-2 px-2 w-full ">
        <div>
          {Object.keys(lobbyGameState.playerStats).length <= MAX_LOBBY_SIZE ? (
            <Link
              onClick={JoiningLobby}
              to={`/gamelobby/${lobbyId}`}
              className="rounded-xl text-l bg-primary-block text-white px-3 py-1.5 mr-4"
            >
              JOIN
            </Link>
          ) : (
            <div />
          )}
          Lobby {lobbyId}
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
