import React from "react";
import { Link, useNavigate } from "react-router-dom";

const SingleLobby = ({ lobby }) => {
  const MAX_LOBBY_SIZE = 5;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between hover:bg-gray-300 text-black text-xl py-2 px-2 w-full ">
        <div>
          <Link
            to={`/gamelobby/${lobby.lobby_id}`}
            className="rounded-xl text-l bg-primary-block text-white px-3 py-1.5 mr-4"
          >
            JOIN
          </Link>
          Lobby {lobby.lobby_id}
        </div>
        <div>
          {lobby.user_ids.length}/{MAX_LOBBY_SIZE}
        </div>
      </div>
      <hr className=" bg-gray-200 h-0.5" />
    </div>
  );
};
export default SingleLobby;
